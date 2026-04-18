import { PhotoService } from "./application/photo.service";
import { PhotosApplication } from "./application/photos.application";
import { photosInfrastructure } from "./infrastructure/photos.repositories";

const photoService = new PhotoService(
	photosInfrastructure.photoRepository,
	photosInfrastructure.userRepository
);
const photosApplication = new PhotosApplication(photoService);

export const photoDomain = {
	photoService,
	photosApplication,
};
