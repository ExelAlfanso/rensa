import type {
	ListRollPhotosQueryDto,
	RollCreateDto,
	RollUpdateDto,
} from "@/backend/dtos/roll.dto";
import type { RollService } from "./roll.service";

export class RollsApplication {
	private readonly rollService: RollService;

	constructor(rollService: RollService) {
		this.rollService = rollService;
	}

	addPhotoToRoll(
		rollId: string,
		photoId: string,
		actorId?: string
	): Promise<number> {
		return this.rollService.addPhotoToRoll(rollId, photoId, actorId);
	}

	create(payload: RollCreateDto, actorId?: string): Promise<unknown> {
		return this.rollService.create(payload, actorId);
	}

	deleteById(rollId: string, actorId?: string): Promise<unknown> {
		return this.rollService.deleteById(rollId, actorId);
	}

	getById(rollId: string): Promise<unknown> {
		return this.rollService.getById(rollId);
	}

	getDefaultByUserId(actorId?: string): Promise<unknown> {
		return this.rollService.getDefaultByUserId(actorId);
	}

	getOwnerId(rollId: string): Promise<string> {
		return this.rollService.getOwnerId(rollId);
	}

	listByUserId(
		userId: string,
		sort: "latest" | "oldest"
	): Promise<{ rolls: unknown[] }> {
		return this.rollService.listByUserId(userId, sort);
	}

	listContainingPhoto(
		photoId: string,
		actorId?: string
	): Promise<{ isSaved: boolean; rollIds: string[]; rolls: unknown[] }> {
		return this.rollService.listContainingPhoto(photoId, actorId);
	}

	listPhotos(rollId: string, query: ListRollPhotosQueryDto): Promise<unknown> {
		return this.rollService.listPhotos(rollId, query);
	}

	removePhotoFromRoll(
		rollId: string,
		photoId: string,
		actorId?: string
	): Promise<void> {
		return this.rollService.removePhotoFromRoll(rollId, photoId, actorId);
	}

	update(
		rollId: string,
		payload: RollUpdateDto,
		actorId?: string
	): Promise<unknown> {
		return this.rollService.update(rollId, payload, actorId);
	}
}
