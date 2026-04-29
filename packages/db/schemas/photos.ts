import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const photos = pgTable(
	"photos",
	{
		photoId: uuid("photo_id").primaryKey().defaultRandom(),
		userId: uuid("user_id").references(() => users.userId, {
			onDelete: "cascade",
		}),
		url: text("url").notNull(),
		title: text("title").notNull(),
		description: text("description"),
		category: text("category"),
		style: text("style"),
		color: text("color"),
		camera: text("camera"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [index("idx_photos_user").on(table.userId)]
);

export const photoMetadata = pgTable("photo_metadata", {
	photoMetadataId: uuid("photo_metadata_id")
		.primaryKey()
		.references(() => photos.photoId, { onDelete: "cascade" }),
	width: integer("width"),
	height: integer("height"),
	format: text("format"),
	size: integer("size"),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true }),
});

interface Passthrough {
	[key: string]: unknown;
}

export interface ListPhotosQueryDto {
	filters?: string[];
	limit: number;
	page: number;
	sort: "recent" | "popular";
}

export interface PhotoResponseDto extends Passthrough {
	bookmarks: number;
	camera: string;
	category: string;
	color: string;
	created_at?: string;
	description: string;
	photo_id: string;
	style: string;
	title: string;
	updated_at?: string;
	url: string;
	user_id:
		| string
		| ({
				avatar?: string;
				user_id: string;
				username?: string;
		  } & Passthrough);
}

export interface ListPhotosResult {
	photos: PhotoResponseDto[];
	total: number;
}

export interface PhotoRepositoryInterface {
	createUploadedPhoto(payload: CreateUploadedPhotoDto): Promise<UploadedPhotoDto>;
	deleteById(id: string): Promise<void>;
	exists(id: string): Promise<boolean>;
	getById(id: string): Promise<PhotoResponseDto | null>;
	getOwnerId(id: string): Promise<string | null>;
	list(query: ListPhotosQueryDto): Promise<ListPhotosResult>;
	listBookmarkedByUser(
		userId: string,
		page: number,
		limit: number
	): Promise<ListPhotosResult>;
	listByIds(
		ids: string[],
		page: number,
		limit: number
	): Promise<ListPhotosResult>;
}

export interface CreateUploadedPhotoDto {
	camera: string;
	category: string;
	color: string;
	description: string;
	format?: string;
	height?: number;
	size?: number;
	style: string;
	title: string;
	uploadedAt?: Date;
	url: string;
	userId: string;
	width?: number;
}

export interface UploadedPhotoDto {
	camera: string | null;
	category: string | null;
	color: string | null;
	createdAt?: Date | null;
	description: string | null;
	format?: string;
	height?: number;
	photoId: string;
	size?: number;
	style: string | null;
	title: string;
	updatedAt?: Date | null;
	uploadedAt?: Date;
	url: string;
	userId: string | null;
	width?: number;
}
