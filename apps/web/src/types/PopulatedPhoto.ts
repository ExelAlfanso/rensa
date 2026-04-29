import type { PhotoMetadata } from "@/frontend/types/photo";

interface PopulatedPhotoUser {
	_id: string;
	avatar?: string;
	username: string;
}

export interface PopulatedPhoto {
	bookmarkedBy?: string[];
	bookmarks?: number;
	camera?: string;
	category?: string;
	color?: string;
	createdAt?: string;
	description: string;
	metadata?: PhotoMetadata;
	photo_id: string;
	style?: string;
	tags?: string[];
	title: string;
	updatedAt?: string;
	url: string;
	userId: PopulatedPhotoUser;
}
