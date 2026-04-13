import type { ListPhotosQueryDto, PhotoResponseDto } from "../dtos/photo.dto";

export interface ListPhotosResult {
	photos: PhotoResponseDto[];
	total: number;
}

export interface PhotoRepositoryInterface {
	deleteById(id: string): Promise<void>;
	exists(id: string): Promise<boolean>;
	getById(id: string): Promise<PhotoResponseDto | null>;
	getOwnerId(id: string): Promise<string | null>;
	list(query: ListPhotosQueryDto): Promise<ListPhotosResult>;
	listBookmarkedByUser(
		userId: string,
		page: number,
		limit: number
	): Promise<ListPhotosResult>;
	listByIds(
		ids: string[],
		page: number,
		limit: number
	): Promise<ListPhotosResult>;
}
