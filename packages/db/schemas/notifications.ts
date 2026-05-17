import {
	boolean,
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const notificationTypeEnum = pgEnum("notification_type", [
	"photo-saved",
	"photo-bookmarked",
	"photo-commented",
]);

export const notifications = pgTable(
	"notifications",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		recipient_id: text("recipient_id").notNull(),
		actor_id: text("actor_id").notNull(),
		type: notificationTypeEnum("type").notNull(),
		photo_id: text("photo_id").notNull(),
		read: boolean("read").notNull().default(false),
		created_at: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updated_at: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		recipient_created_at_idx: index(
			"notifications_recipient_created_at_idx"
		).on(table.recipient_id, table.created_at),
		created_at_idx: index("notifications_created_at_idx").on(table.created_at),
	})
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type NotificationType = (typeof notificationTypeEnum.enumValues)[number];

interface Passthrough {
	[key: string]: unknown;
}

export interface NotificationActorDto extends Passthrough {
	avatar: string;
	id: string;
	username: string;
}

export interface NotificationResponseDto extends Passthrough {
	actor_id: NotificationActorDto;
	created_at?: Date | string;
	id: string;
	message: string;
	photo_id: string;
	read: boolean;
	recipient_id: string;
	type: string;
	updated_at?: Date | string;
}

export interface ListNotificationsQueryDto {
	limit: number;
	page: number;
	recipient_id: string;
}

export interface CreateNotificationDto {
	actor_id: string;
	photo_id: string;
	recipient_id: string;
	type: string;
}

export interface NotificationRepositoryInterface {
	clearByUserId(user_id: string): Promise<void>;
	create(payload: CreateNotificationDto): Promise<unknown>;
	list(query: ListNotificationsQueryDto): Promise<NotificationResponseDto[]>;
	markAsRead(notificationId: string): Promise<void>;
}
