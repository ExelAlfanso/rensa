import { CommentService } from "./application/comment.service";
import { CommentsApplication } from "./application/comments.application";
import { commentsInfrastructure } from "./infrastructure/comments.repositories";

const commentService = new CommentService(
	commentsInfrastructure.commentRepository
);
const commentsApplication = new CommentsApplication(commentService);

export const commentDomain = {
	commentService,
	commentsApplication,
};
