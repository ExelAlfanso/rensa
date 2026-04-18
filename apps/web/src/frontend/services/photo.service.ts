import { api } from "@/lib/axios-client";
import type { PopulatedPhoto } from "@/types/PopulatedPhoto";

export interface PhotoMetadata {
	exif?: Record<string, string>;
	format: "jpg" | "jpeg";
	height: number;
	size: number;
	uploadedAt: Date | string;
	width: number;
}

export interface Photo {
	_id: string;
	bookmarks: number;
	createdAt?: string;
	description: string;
	metadata: PhotoMetadata;
	tags: string[];
	title: string;
	updatedAt?: string;
	url: string;
	userId: string;
}

interface BackendPhotosResponse {
	currentPage: number;
	hasMore: boolean;
	photos: PopulatedPhoto[];
	total: number;
	totalPages: number;
}

export interface FetchPhotosResponse {
	data: PopulatedPhoto[];
	nextPage: number | undefined;
	source?: ExplorePhotoSource;
	urls: string[];
}

export type ExplorePhotoSource = "db" | "picsum";

export const fetchPhotosFromDB = async (
	page: number,
	filters: string[] | undefined,
	sort: "popular" | "recent" = "recent"
): Promise<FetchPhotosResponse> => {
	const params: Record<string, number | string | undefined> = {
		page,
		limit: 10,
		sort,
		filters: filters?.join(","),
	};

	const res = await api.get<BackendPhotosResponse>("/photos", { params });

	return {
		data: res.data.photos,
		urls: res.data.photos.map((photo) => photo.url),
		nextPage: res.data.hasMore ? page + 1 : undefined,
	};
};

export const fetchBookmarkedPhotosFromDB = async (
	userId: string,
	page: number
): Promise<FetchPhotosResponse> => {
	const params: Record<string, number | string | undefined> = {
		userId,
		page,
		limit: 10,
	};

	const res = await api.get<BackendPhotosResponse>("/photos/bookmark", {
		params,
	});

	return {
		data: res.data.photos,
		urls: res.data.photos.map((photo) => photo.url),
		nextPage: res.data.hasMore ? page + 1 : undefined,
	};
};

export const fetchPhotosFromRoll = async (
	rollId: string,
	page: number,
	filters?: string[],
	sort: "popular" | "recent" = "recent"
): Promise<FetchPhotosResponse> => {
	const params: Record<string, number | string | undefined> = {
		page,
		limit: 10,
		sort,
		filters: filters?.join(","),
	};

	const res = await api.get(`/rolls/${rollId}/photos`, { params });

	return {
		data: res.data.data.photos,
		urls: res.data.data.photos.map((photo: PopulatedPhoto) => photo.url),
		nextPage: res.data.data.hasMore ? page + 1 : undefined,
	};
};

interface PicsumPhotosResponse {
	hasMore: boolean;
	photos: PopulatedPhoto[];
}

const getExplorePhotoSource = (): ExplorePhotoSource => {
	const requestedSource = process.env.NEXT_PUBLIC_EXPLORE_SOURCE;
	if (process.env.NODE_ENV === "production") {
		return "db";
	}
	if (requestedSource === "picsum") {
		return "picsum";
	}
	return "db";
};

export const fetchExplorePhotos = async (
	page: number,
	filters: string[] | undefined,
	sort: "popular" | "recent" = "recent"
): Promise<FetchPhotosResponse> => {
	const source = getExplorePhotoSource();
	if (source === "db") {
		const response = await fetchPhotosFromDB(page, filters, sort);
		return { ...response, source };
	}

	const params: Record<string, number | string | undefined> = {
		page,
		limit: 10,
		sort,
		filters: filters?.join(" "),
	};

	const response = await api.get<PicsumPhotosResponse>("/photos/debug/picsum", {
		params,
	});
	return {
		data: response.data.photos,
		urls: response.data.photos.map((photo) => photo.url),
		nextPage: response.data.hasMore ? page + 1 : undefined,
		source,
	};
};

export const fetchPhotoOwnerByPhotoId = async (photoId: string) => {
	const res = await api.get<{ data: { ownerId: string } }>(
		`/photos/${photoId}/owner`
	);
	return res.data.data.ownerId;
};

export const fetchPhotoById = async (photoId: string) => {
	const res = await api.get(`/photos/${photoId}`);
	return res.data.data;
};

export const fetchUserBookmarkedPhotos = async (userId: string) => {
	const res = await api.get(`/users/${userId}`);
	return res.data.data.user.bookmarks;
};
