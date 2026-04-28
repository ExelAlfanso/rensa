import { PhotoRepository } from "@/backend/domains/photos/infrastructure/photo.repository";
import { RollRepository } from "./roll.repository";

const photoRepository = new PhotoRepository();
const rollRepository = new RollRepository();

export const rollsInfrastructure = {
	photoRepository,
	rollRepository,
};
