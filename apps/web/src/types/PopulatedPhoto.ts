import type { PhotoMetadata } from "@/frontend/types/photo";

interface PopulatedPhotoUser {
	_id: string;
	avatar?: string;
	username: string;
}

export interface PopulatedPhoto {
	_id: string;
	bookmarkedBy?: string[];
	bookmarks?: number;
	camera?: string;
	category?: string;
	color?: string;
	createdAt?: string;
	description: string;
	metadata?: PhotoMetadata;
	style?: string;
	tags?: string[];
	title: string;
	updatedAt?: string;
	url: string;
	userId: PopulatedPhotoUser;
}
