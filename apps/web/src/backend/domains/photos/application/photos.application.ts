import type { ListPhotosQueryDto } from "@/backend/dtos/photo.dto";
import type { PhotoService } from "./photo.service";

export class PhotosApplication {
	private readonly photoService: PhotoService;

	constructor(photoService: PhotoService) {
		this.photoService = photoService;
	}

	deleteById(photoId: string, actorId: string): Promise<void> {
		return this.photoService.deleteById(photoId, actorId);
	}

	getById(photoId: string): Promise<unknown> {
		return this.photoService.getById(photoId);
	}

	getOwnerId(photoId: string): Promise<string> {
		return this.photoService.getOwnerId(photoId);
	}

	list(query: ListPhotosQueryDto): Promise<unknown> {
		return this.photoService.list(query);
	}

	listBookmarkedByUser(
		userId: string,
		page: number,
		limit: number
	): Promise<unknown> {
		return this.photoService.listBookmarkedByUser(userId, page, limit);
	}
}
