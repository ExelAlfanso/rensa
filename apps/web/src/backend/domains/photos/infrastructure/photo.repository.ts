import { count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { bookmarks, photos } from "@/backend/db/schema";
import type {
	ListPhotosQueryDto,
	PhotoResponseDto,
} from "@/backend/dtos/photo.dto";
import type {
	ListPhotosResult,
	PhotoRepositoryInterface,
} from "@/backend/interfaces/photo-repository.interface";
import db from "@/lib/drizzle";

type PhotoRow = typeof photos.$inferSelect;

const toIso = (value: Date | null): string | undefined =>
	value ? value.toISOString() : undefined;

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

		const rows = await db
			.select({
				count: count(bookmarks.photoId),
				photoId: bookmarks.photoId,
			})
			.from(bookmarks)
			.where(inArray(bookmarks.photoId, photoIds))
			.groupBy(bookmarks.photoId);

		for (const row of rows) {
			if (!row.photoId) {
				continue;
			}
			bookmarkCountByPhotoId.set(row.photoId, Number(row.count));
		}

		return bookmarkCountByPhotoId;
	}

	private mapToPhotoResponseDto(
		photo: PhotoRow,
		bookmarksCount: number
	): PhotoResponseDto {
		return {
			photo_id: photo.photoId,
			user_id: photo.userId ?? "",
			url: photo.url,
			title: photo.title,
			description: photo.description ?? "",
			category: photo.category ?? "",
			style: photo.style ?? "",
			color: photo.color ?? "",
			camera: photo.camera ?? "",
			bookmarks: bookmarksCount,
			created_at: toIso(photo.createdAt),
			updated_at: toIso(photo.updatedAt),
		};
	}

	private async mapPhotosToResponseDtos(
		photoRows: PhotoRow[]
	): Promise<PhotoResponseDto[]> {
		const photoIds = photoRows.map((photo) => photo.photoId);
		const bookmarkCountByPhotoId =
			await this.countBookmarksByPhotoIds(photoIds);
		return photoRows.map((photo) =>
			this.mapToPhotoResponseDto(
				photo,
				bookmarkCountByPhotoId.get(photo.photoId) ?? 0
			)
		);
	}

	private async getPhotosByIdsInOrder(photoIds: string[]): Promise<PhotoRow[]> {
		if (photoIds.length === 0) {
			return [];
		}

		const photoRows = await db
			.select()
			.from(photos)
			.where(inArray(photos.photoId, photoIds));

		const orderByPhotoId = new Map(photoIds.map((id, index) => [id, index]));
		photoRows.sort(
			(a, b) =>
				(orderByPhotoId.get(a.photoId) ?? Number.MAX_SAFE_INTEGER) -
				(orderByPhotoId.get(b.photoId) ?? Number.MAX_SAFE_INTEGER)
		);

		return photoRows;
	}

	private buildFilterWhere(filters?: string[]) {
		if (!(filters && filters.length > 0)) {
			return undefined;
		}
		const conditions = filters.flatMap((filter) => {
			const needle = `%${filter}%`;
			return [
				ilike(photos.category, needle),
				ilike(photos.style, needle),
				ilike(photos.color, needle),
			];
		});
		return or(...conditions);
	}

	async list(query: ListPhotosQueryDto): Promise<ListPhotosResult> {
		const from = (query.page - 1) * query.limit;
		const whereClause = this.buildFilterWhere(query.filters);
		let photoRows: PhotoRow[] = [];

		if (query.sort === "popular") {
			const popularRows = await db
				.select({
					photoId: photos.photoId,
				})
				.from(photos)
				.leftJoin(bookmarks, eq(bookmarks.photoId, photos.photoId))
				.where(whereClause)
				.groupBy(photos.photoId)
				.orderBy(desc(count(bookmarks.bookmarkId)), desc(photos.createdAt))
				.limit(query.limit)
				.offset(from);

			const orderedPhotoIds = popularRows.map((row) => row.photoId);
			photoRows = await this.getPhotosByIdsInOrder(orderedPhotoIds);
		} else {
			photoRows = await db
				.select()
				.from(photos)
				.where(whereClause)
				.orderBy(desc(photos.createdAt))
				.limit(query.limit)
				.offset(from);
		}

		const [countRow] = await db
			.select({ total: count() })
			.from(photos)
			.where(whereClause);

		const photosResult = await this.mapPhotosToResponseDtos(photoRows);
		return {
			photos: photosResult,
			total: Number(countRow?.total ?? 0),
		};
	}

	async getById(id: string): Promise<PhotoResponseDto | null> {
		const [row] = await db
			.select()
			.from(photos)
			.where(eq(photos.photoId, id))
			.limit(1);
		if (!row) {
			return null;
		}

		const bookmarkCountByPhotoId = await this.countBookmarksByPhotoIds([id]);
		return this.mapToPhotoResponseDto(row, bookmarkCountByPhotoId.get(id) ?? 0);
	}

	async getOwnerId(id: string): Promise<string | null> {
		const [row] = await db
			.select({ userId: photos.userId })
			.from(photos)
			.where(eq(photos.photoId, id))
			.limit(1);
		return row?.userId ?? null;
	}

	async deleteById(id: string): Promise<void> {
		await db.delete(photos).where(eq(photos.photoId, id));
	}

	async exists(id: string): Promise<boolean> {
		const [row] = await db
			.select({ id: photos.photoId })
			.from(photos)
			.where(eq(photos.photoId, id))
			.limit(1);
		return Boolean(row);
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
		const whereClause = inArray(photos.photoId, ids);

		const photoRows = await db
			.select()
			.from(photos)
			.where(whereClause)
			.orderBy(desc(photos.createdAt))
			.limit(limit)
			.offset(from);
		const [countRow] = await db
			.select({ total: count() })
			.from(photos)
			.where(whereClause);

		const photosResult = await this.mapPhotosToResponseDtos(photoRows);
		return {
			photos: photosResult,
			total: Number(countRow?.total ?? 0),
		};
	}

	async listBookmarkedByUser(
		userId: string,
		page: number,
		limit: number
	): Promise<ListPhotosResult> {
		const from = (page - 1) * limit;

		const bookmarkRows = await db
			.select({ photoId: bookmarks.photoId })
			.from(bookmarks)
			.where(eq(bookmarks.userId, userId))
			.orderBy(desc(bookmarks.createdAt))
			.limit(limit)
			.offset(from);
		const [countRow] = await db
			.select({ total: count() })
			.from(bookmarks)
			.where(eq(bookmarks.userId, userId));

		const photoIds = bookmarkRows
			.map((row) => row.photoId)
			.filter((value): value is string => Boolean(value));
		if (photoIds.length === 0) {
			return {
				photos: [],
				total: Number(countRow?.total ?? 0),
			};
		}

		const photoRows = await this.getPhotosByIdsInOrder(photoIds);

		const photosResult = await this.mapPhotosToResponseDtos(photoRows);
		return {
			photos: photosResult,
			total: Number(countRow?.total ?? photosResult.length),
		};
	}
}
