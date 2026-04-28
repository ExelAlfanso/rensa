import type {
	RollCreateDto,
	RollResponseDto,
	RollUpdateDto,
} from "../dtos/roll.dto";

export interface RollRepositoryInterface {
	addPhotoToRoll(rollId: string, photoId: string): Promise<number>;
	create(payload: RollCreateDto): Promise<RollResponseDto>;
	deleteById(rollId: string): Promise<RollResponseDto | null>;
	getById(rollId: string): Promise<RollResponseDto | null>;
	getDefaultByUserId(userId: string): Promise<RollResponseDto | null>;
	listByUserId(
		userId: string,
		sort: "latest" | "oldest"
	): Promise<RollResponseDto[]>;
	listContainingPhoto(
		userId: string,
		photoId: string
	): Promise<Array<{ roll_id: string; name: string }>>;
	removePhotoFromRoll(rollId: string, photoId: string): Promise<void>;
	update(
		rollId: string,
		payload: RollUpdateDto
	): Promise<RollResponseDto | null>;
}
