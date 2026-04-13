import type { CommentResponseDto } from "../dtos/comment.dto";

export interface ListCommentsResult {
	comments: CommentResponseDto[];
	total: number;
}

export interface CommentRepositoryInterface {
	create(params: {
		photoId: string;
		userId: string;
		text: string;
	}): Promise<CommentResponseDto>;
	listByPhotoId(params: {
		photoId: string;
		offset: number;
		limit: number;
	}): Promise<ListCommentsResult>;
}
