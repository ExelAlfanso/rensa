import type {
	RollCreateDto,
	RollResponseDto,
	RollUpdateDto,
} from "@/backend/dtos/roll.dto";
import type { RollRepositoryInterface } from "@/backend/interfaces/roll-repository.interface";
import { supabaseAdmin } from "@/lib/supabase";

interface RollRow {
	created_at: string | null;
	description: string | null;
	image_url: string | null;
	name: string;
	roll_id: string;
	updated_at: string | null;
	user_id: string;
}

interface RollPhotoRow {
	photo_id: string;
	roll_id: string;
}

const NO_ROWS_CODE = "PGRST116";

const isNoRowsError = (error: { code?: string } | null): boolean =>
	error?.code === NO_ROWS_CODE;

export class RollRepository implements RollRepositoryInterface {
	private async getPhotoIdsByRollIds(
		rollIds: string[]
	): Promise<Map<string, string[]>> {
		const photoIdsByRollId = new Map<string, string[]>();
		for (const rollId of rollIds) {
			photoIdsByRollId.set(rollId, []);
		}
		if (rollIds.length === 0) {
			return photoIdsByRollId;
		}

		const { data, error } = await supabaseAdmin
			.from("roll_photos")
			.select("roll_id,photo_id")
			.in("roll_id", rollIds);
		if (error) {
			throw new Error(`Failed to fetch roll photos: ${error.message}`);
		}

		for (const row of (data ?? []) as RollPhotoRow[]) {
			const existing = photoIdsByRollId.get(row.roll_id) ?? [];
			existing.push(row.photo_id);
			photoIdsByRollId.set(row.roll_id, existing);
		}

		return photoIdsByRollId;
	}

	private mapToRollResponseDto(
		roll: RollRow,
		photoIds: string[]
	): RollResponseDto {
		return {
			roll_id: roll.roll_id,
			user_id: roll.user_id,
			name: roll.name,
			description: roll.description ?? "",
			imageUrl: roll.image_url ?? "/images/image6.JPG",
			photos: photoIds,
			createdAt: roll.created_at ?? undefined,
			updatedAt: roll.updated_at ?? undefined,
		};
	}

	async create(payload: RollCreateDto): Promise<RollResponseDto> {
		const { data, error } = await supabaseAdmin
			.from("rolls")
			.insert({
				description: payload.description ?? "",
				image_url: payload.imageUrl ?? "/images/image6.JPG",
				name: payload.name,
				user_id: payload.user_id,
			})
			.select(
				"roll_id,user_id,name,description,image_url,created_at,updated_at"
			)
			.single();
		if (error || !data) {
			throw new Error(`Failed to create roll: ${error?.message ?? "No data"}`);
		}

		return this.mapToRollResponseDto(data as RollRow, []);
	}

	async getById(rollId: string): Promise<RollResponseDto | null> {
		const { data, error } = await supabaseAdmin
			.from("rolls")
			.select(
				"roll_id,user_id,name,description,image_url,created_at,updated_at"
			)
			.eq("roll_id", rollId)
			.single();
		if (isNoRowsError(error)) {
			return null;
		}
		if (error || !data) {
			throw new Error(
				`Failed to fetch roll by id: ${error?.message ?? "No data"}`
			);
		}

		const photoIdsByRollId = await this.getPhotoIdsByRollIds([rollId]);
		return this.mapToRollResponseDto(
			data as RollRow,
			photoIdsByRollId.get(rollId) ?? []
		);
	}

	async getDefaultByUserId(userId: string): Promise<RollResponseDto | null> {
		const { data, error } = await supabaseAdmin
			.from("rolls")
			.select(
				"roll_id,user_id,name,description,image_url,created_at,updated_at"
			)
			.eq("user_id", userId)
			.eq("name", "All Photos")
			.single();
		if (isNoRowsError(error)) {
			return null;
		}
		if (error || !data) {
			throw new Error(
				`Failed to fetch default roll: ${error?.message ?? "No data"}`
			);
		}

		const roll = data as RollRow;
		const photoIdsByRollId = await this.getPhotoIdsByRollIds([roll.roll_id]);
		return this.mapToRollResponseDto(
			roll,
			photoIdsByRollId.get(roll.roll_id) ?? []
		);
	}

	async listContainingPhoto(
		userId: string,
		photoId: string
	): Promise<Array<{ roll_id: string; name: string }>> {
		const { data: rollsData, error: rollsError } = await supabaseAdmin
			.from("rolls")
			.select("roll_id,name")
			.eq("user_id", userId);
		if (rollsError) {
			throw new Error(`Failed to list user rolls: ${rollsError.message}`);
		}

		const userRolls = (rollsData ?? []) as Array<{
			name: string;
			roll_id: string;
		}>;
		if (userRolls.length === 0) {
			return [];
		}

		const rollIds = userRolls.map((roll) => roll.roll_id);
		const { data: linksData, error: linksError } = await supabaseAdmin
			.from("roll_photos")
			.select("roll_id")
			.eq("photo_id", photoId)
			.in("roll_id", rollIds);
		if (linksError) {
			throw new Error(`Failed to list saved rolls: ${linksError.message}`);
		}

		const linkedRollIds = new Set(
			((linksData ?? []) as Array<{ roll_id: string }>).map(
				(row) => row.roll_id
			)
		);
		return userRolls.filter((roll) => linkedRollIds.has(roll.roll_id));
	}

	async listByUserId(
		userId: string,
		sort: "latest" | "oldest"
	): Promise<RollResponseDto[]> {
		const { data, error } = await supabaseAdmin
			.from("rolls")
			.select(
				"roll_id,user_id,name,description,image_url,created_at,updated_at"
			)
			.eq("user_id", userId)
			.order("created_at", { ascending: sort === "oldest" });
		if (error) {
			throw new Error(`Failed to list rolls: ${error.message}`);
		}

		const rolls = (data ?? []) as RollRow[];
		const rollIds = rolls.map((roll) => roll.roll_id);
		const photoIdsByRollId = await this.getPhotoIdsByRollIds(rollIds);
		return rolls.map((roll) =>
			this.mapToRollResponseDto(roll, photoIdsByRollId.get(roll.roll_id) ?? [])
		);
	}

	async addPhotoToRoll(rollId: string, photoId: string): Promise<number> {
		const { data: roll, error: rollError } = await supabaseAdmin
			.from("rolls")
			.select("roll_id")
			.eq("roll_id", rollId)
			.single();
		if (isNoRowsError(rollError) || !roll) {
			return 0;
		}
		if (rollError) {
			throw new Error(`Failed to verify roll: ${rollError}`);
		}

		const { error } = await supabaseAdmin.from("roll_photos").upsert(
			{
				photo_id: photoId,
				roll_id: rollId,
			},
			{
				ignoreDuplicates: true,
				onConflict: "roll_id,photo_id",
			}
		);
		if (error) {
			throw new Error(`Failed to add photo to roll: ${error.message}`);
		}

		return 1;
	}

	async removePhotoFromRoll(rollId: string, photoId: string): Promise<void> {
		const { error } = await supabaseAdmin
			.from("roll_photos")
			.delete()
			.eq("roll_id", rollId)
			.eq("photo_id", photoId);
		if (error) {
			throw new Error(`Failed to remove photo from roll: ${error.message}`);
		}
	}

	async update(
		rollId: string,
		payload: RollUpdateDto
	): Promise<RollResponseDto | null> {
		const { data, error } = await supabaseAdmin
			.from("rolls")
			.update({
				description: payload.description,
				image_url: payload.imageUrl,
				name: payload.name,
			})
			.eq("roll_id", rollId)
			.select(
				"roll_id,user_id,name,description,image_url,created_at,updated_at"
			)
			.single();
		if (isNoRowsError(error)) {
			return null;
		}
		if (error || !data) {
			throw new Error(`Failed to update roll: ${error?.message ?? "No data"}`);
		}

		const photoIdsByRollId = await this.getPhotoIdsByRollIds([rollId]);
		return this.mapToRollResponseDto(
			data as RollRow,
			photoIdsByRollId.get(rollId) ?? []
		);
	}

	async deleteById(rollId: string): Promise<RollResponseDto | null> {
		const existing = await this.getById(rollId);
		if (!existing) {
			return null;
		}

		const { error } = await supabaseAdmin
			.from("rolls")
			.delete()
			.eq("roll_id", rollId);
		if (error) {
			throw new Error(`Failed to delete roll: ${error.message}`);
		}

		return existing;
	}
}
