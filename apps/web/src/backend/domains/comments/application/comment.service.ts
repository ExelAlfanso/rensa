import {
	ForbiddenError,
	UnauthorizedError,
	ValidationError,
} from "@/backend/common/backend.error";
import type { CreateCommentDto } from "@/backend/dtos/comment.dto";
import type { CommentRepositoryInterface } from "@/backend/interfaces/comment-repository.interface";

interface ListCommentsResult {
	comments: unknown[];
	hasMore: boolean;
	total: number;
}

export class CommentService {
	readonly commentRepository: CommentRepositoryInterface;

	constructor(commentRepository: CommentRepositoryInterface) {
		this.commentRepository = commentRepository;
	}

	async createForPhoto(
		photoId: string,
		payload: CreateCommentDto,
		actorId?: string
	): Promise<unknown> {
		const effectiveActorId = actorId ?? payload.userId;
		if (!effectiveActorId) {
			throw new UnauthorizedError();
		}

		if (payload.userId && payload.userId !== effectiveActorId) {
			throw new ForbiddenError(
				"Cannot create comments on behalf of other users"
			);
		}

		try {
			return await this.commentRepository.create({
				photoId,
				userId: effectiveActorId,
				text: payload.text,
			});
		} catch {
			throw new ValidationError("Invalid comment payload");
		}
	}

	async listByPhotoId(
		photoId: string,
		offset: number,
		limit: number
	): Promise<ListCommentsResult> {
		const { comments, total } = await this.commentRepository.listByPhotoId({
			photoId,
			offset,
			limit,
		});

		return {
			comments,
			hasMore: offset + comments.length < total,
			total,
		};
	}
}
