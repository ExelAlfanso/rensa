import { CommentRepository } from "./comment.repository";

const commentRepository = new CommentRepository();

export const commentsInfrastructure = {
	commentRepository,
};
