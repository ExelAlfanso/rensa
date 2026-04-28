import { UserRepository } from "@/backend/domains/users/infrastructure/user.repository";
import { PhotoRepository } from "./photo.repository";

const photoRepository = new PhotoRepository();
const userRepository = new UserRepository();

export const photosInfrastructure = {
	photoRepository,
	userRepository,
};
