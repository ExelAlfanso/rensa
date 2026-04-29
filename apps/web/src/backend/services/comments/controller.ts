import type { CreateCommentDto } from "@rensa/db/schema";
import { CommentRepository } from "@rensa/db/queries/comment.repository";
import { CommentService, type ListCommentsResult } from "./service";

export class CommentsController {
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
	): Promise<ListCommentsResult> {
		return this.commentService.listByPhotoId(photoId, offset, limit);
	}
}

const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);

export const commentController = new CommentsController(commentService);

