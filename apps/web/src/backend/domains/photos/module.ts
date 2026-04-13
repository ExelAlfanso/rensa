import { PhotoService } from "./application/photo.service";
import { PhotosApplication } from "./application/photos.application";
import { photosInfrastructure } from "./infrastructure/photos.repositories";

const photosApplication = new PhotosApplication(
	new PhotoService(
		photosInfrastructure.photoRepository,
		photosInfrastructure.userRepository
	)
);

export const photoDomain = {
	...photosInfrastructure,
	photosApplication,
};
