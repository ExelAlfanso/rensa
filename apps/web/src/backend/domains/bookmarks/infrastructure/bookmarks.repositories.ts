import { PhotoRepository } from "@/backend/domains/photos/infrastructure/photo.repository";
import { UserRepository } from "@/backend/domains/users/infrastructure/user.repository";

const photoRepository = new PhotoRepository();
const userRepository = new UserRepository();

export const bookmarksInfrastructure = {
	photoRepository,
	userRepository,
};
