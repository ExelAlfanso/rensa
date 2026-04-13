import { CommentService } from "./application/comment.service";
import { CommentsApplication } from "./application/comments.application";
import { commentsInfrastructure } from "./infrastructure/comments.repositories";

const commentsApplication = new CommentsApplication(
	new CommentService(commentsInfrastructure.commentRepository)
);

export const commentDomain = {
	...commentsInfrastructure,
	commentsApplication,
};
