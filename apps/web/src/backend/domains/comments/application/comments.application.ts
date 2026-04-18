import type { CreateCommentDto } from "@/backend/dtos/comment.dto";
import type { CommentService } from "./comment.service";

export class CommentsApplication {
	private readonly commentService: CommentService;

	constructor(commentService: CommentService) {
		this.commentService = commentService;
	}

	createForPhoto(
		photoId: string,
		payload: CreateCommentDto,
		actorId?: string
	): Promise<unknown> {
		return this.commentService.createForPhoto(photoId, payload, actorId);
	}

	listByPhotoId(
		photoId: string,
		offset: number,
		limit: number
	): Promise<unknown> {
		return this.commentService.listByPhotoId(photoId, offset, limit);
	}
}
