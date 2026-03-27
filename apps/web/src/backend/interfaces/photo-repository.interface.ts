import type { CreatePhotoDto, PhotoResponseDto } from "../dtos/photo.dto";
export interface PhotoRepositoryInterface {
	create(photo: CreatePhotoDto): Promise<PhotoResponseDto>;
	getAll(): Promise<PhotoResponseDto[]>;
	getById(id: string): Promise<PhotoResponseDto>;
}
