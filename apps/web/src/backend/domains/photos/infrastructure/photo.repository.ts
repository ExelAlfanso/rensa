import type {
	ListPhotosQueryDto,
	PhotoResponseDto,
} from "@/backend/dtos/photo.dto";
import type {
	ListPhotosResult,
	PhotoRepositoryInterface,
} from "@/backend/interfaces/photo-repository.interface";
import { supabaseAdmin } from "@/lib/supabase";

interface PhotoRow {
	camera: string | null;
	category: string | null;
	color: string | null;
	created_at: string | null;
	description: string | null;
	photo_id: string;
	style: string | null;
	title: string;
	updated_at: string | null;
	url: string;
	user_id: string;
}

interface BookmarkRow {
	photo_id: string;
}

const NO_ROWS_CODE = "PGRST116";

const isNoRowsError = (error: { code?: string } | null): boolean =>
	error?.code === NO_ROWS_CODE;

export class PhotoRepository implements PhotoRepositoryInterface {
	private async countBookmarksByPhotoIds(
		photoIds: string[]
	): Promise<Map<string, number>> {
		const bookmarkCountByPhotoId = new Map<string, number>();
		for (const photoId of photoIds) {
			bookmarkCountByPhotoId.set(photoId, 0);
		}
		if (photoIds.length === 0) {
			return bookmarkCountByPhotoId;
		}

		const { data, error } = await supabaseAdmin
			.from("bookmarks")
			.select("photo_id")
			.in("photo_id", photoIds);
		if (error) {
			throw new Error(`Failed to count photo bookmarks: ${error.message}`);
		}

		for (const row of (data ?? []) as BookmarkRow[]) {
			const currentCount = bookmarkCountByPhotoId.get(row.photo_id) ?? 0;
			bookmarkCountByPhotoId.set(row.photo_id, currentCount + 1);
		}

		return bookmarkCountByPhotoId;
	}

	private mapToPhotoResponseDto(
		photo: PhotoRow,
		bookmarks: number
	): PhotoResponseDto {
		return {
			photo_id: photo.photo_id,
			user_id: photo.user_id,
			url: photo.url,
			title: photo.title,
			description: photo.description ?? "",
			category: photo.category ?? "",
			style: photo.style ?? "",
			color: photo.color ?? "",
			camera: photo.camera ?? "",
			bookmarks,
			created_at: photo.created_at ?? undefined,
			updated_at: photo.updated_at ?? undefined,
		};
	}

	private async mapPhotosToResponseDtos(
		photos: PhotoRow[]
	): Promise<PhotoResponseDto[]> {
		const photoIds = photos.map((photo) => photo.photo_id);
		const bookmarkCountByPhotoId =
			await this.countBookmarksByPhotoIds(photoIds);
		return photos.map((photo) =>
			this.mapToPhotoResponseDto(
				photo,
				bookmarkCountByPhotoId.get(photo.photo_id) ?? 0
			)
		);
	}

	async list(query: ListPhotosQueryDto): Promise<ListPhotosResult> {
		let baseQuery = supabaseAdmin
			.from("photos")
			.select(
				"photo_id,user_id,url,title,description,category,style,color,camera,created_at,updated_at",
				{ count: "exact" }
			);

		if (query.filters && query.filters.length > 0) {
			baseQuery = baseQuery.or(
				query.filters
					.map((filter) => `category.ilike.%${filter}%`)
					.concat(query.filters.map((filter) => `style.ilike.%${filter}%`))
					.concat(query.filters.map((filter) => `color.ilike.%${filter}%`))
					.join(",")
			);
		}

		const from = (query.page - 1) * query.limit;
		const to = from + query.limit - 1;
		const { data, error, count } = await baseQuery
			.order("created_at", { ascending: false })
			.range(from, to);
		if (error) {
			throw new Error(`Failed to list photos: ${error.message}`);
		}

		const photoRows = (data ?? []) as PhotoRow[];
		const photos = await this.mapPhotosToResponseDtos(photoRows);
		return {
			photos,
			total: count ?? 0,
		};
	}

	async getById(id: string): Promise<PhotoResponseDto | null> {
		const { data, error } = await supabaseAdmin
			.from("photos")
			.select(
				"photo_id,user_id,url,title,description,category,style,color,camera,created_at,updated_at"
			)
			.eq("photo_id", id)
			.single();
		if (isNoRowsError(error)) {
			return null;
		}
		if (error || !data) {
			throw new Error(
				`Failed to fetch photo by id: ${error?.message ?? "No data"}`
			);
		}

		const bookmarkCountByPhotoId = await this.countBookmarksByPhotoIds([id]);
		return this.mapToPhotoResponseDto(
			data as PhotoRow,
			bookmarkCountByPhotoId.get(id) ?? 0
		);
	}

	async getOwnerId(id: string): Promise<string | null> {
		const { data, error } = await supabaseAdmin
			.from("photos")
			.select("user_id")
			.eq("photo_id", id)
			.single();
		if (isNoRowsError(error)) {
			return null;
		}
		if (error || !data) {
			throw new Error(
				`Failed to fetch photo owner id: ${error?.message ?? "No data"}`
			);
		}

		return (data as { user_id: string }).user_id;
	}

	async deleteById(id: string): Promise<void> {
		const { error } = await supabaseAdmin
			.from("photos")
			.delete()
			.eq("photo_id", id);
		if (error) {
			throw new Error(`Failed to delete photo: ${error.message}`);
		}
	}

	async exists(id: string): Promise<boolean> {
		const { data, error } = await supabaseAdmin
			.from("photos")
			.select("photo_id")
			.eq("photo_id", id)
			.single();
		if (isNoRowsError(error)) {
			return false;
		}
		if (error) {
			throw new Error(`Failed to verify photo existence: ${error.message}`);
		}

		return !!data;
	}

	async listByIds(
		ids: string[],
		page: number,
		limit: number
	): Promise<ListPhotosResult> {
		if (ids.length === 0) {
			return {
				photos: [],
				total: 0,
			};
		}

		const from = (page - 1) * limit;
		const to = from + limit - 1;
		const { data, error, count } = await supabaseAdmin
			.from("photos")
			.select(
				"photo_id,user_id,url,title,description,category,style,color,camera,created_at,updated_at",
				{ count: "exact" }
			)
			.in("photo_id", ids)
			.order("created_at", { ascending: false })
			.range(from, to);
		if (error) {
			throw new Error(`Failed to list photos by ids: ${error.message}`);
		}

		const photoRows = (data ?? []) as PhotoRow[];
		const photos = await this.mapPhotosToResponseDtos(photoRows);
		return {
			photos,
			total: count ?? 0,
		};
	}

	async listBookmarkedByUser(
		userId: string,
		page: number,
		limit: number
	): Promise<ListPhotosResult> {
		const from = (page - 1) * limit;
		const to = from + limit - 1;

		const {
			data: bookmarksData,
			error: bookmarksError,
			count,
		} = await supabaseAdmin
			.from("bookmarks")
			.select("photo_id", { count: "exact" })
			.eq("user_id", userId)
			.order("created_at", { ascending: false })
			.range(from, to);
		if (bookmarksError) {
			throw new Error(
				`Failed to fetch bookmarked photo ids: ${bookmarksError.message}`
			);
		}

		const photoIds = ((bookmarksData ?? []) as BookmarkRow[]).map(
			(row) => row.photo_id
		);
		if (photoIds.length === 0) {
			return {
				photos: [],
				total: count ?? 0,
			};
		}

		const { data: photosData, error: photosError } = await supabaseAdmin
			.from("photos")
			.select(
				"photo_id,user_id,url,title,description,category,style,color,camera,created_at,updated_at"
			)
			.in("photo_id", photoIds);
		if (photosError) {
			throw new Error(
				`Failed to fetch bookmarked photos: ${photosError.message}`
			);
		}

		const photoRows = (photosData ?? []) as PhotoRow[];
		const orderByPhotoId = new Map(photoIds.map((id, index) => [id, index]));
		photoRows.sort(
			(a, b) =>
				(orderByPhotoId.get(a.photo_id) ?? Number.MAX_SAFE_INTEGER) -
				(orderByPhotoId.get(b.photo_id) ?? Number.MAX_SAFE_INTEGER)
		);

		const photos = await this.mapPhotosToResponseDtos(photoRows);
		return {
			photos,
			total: count ?? photoRows.length,
		};
	}
}
