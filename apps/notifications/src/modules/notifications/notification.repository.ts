import { count, desc, eq } from "drizzle-orm";
import { db } from "../../database";
import { notifications } from "../../database/schema";
import type {
	CreateNotificationInput,
	NotificationRecord,
} from "./notification.model";

export const NotificationRepository = {
	async findByRecipient(params: {
		recipientId: string;
		limit: number;
		offset: number;
	}): Promise<NotificationRecord[]> {
		return await db
			.select()
			.from(notifications)
			.where(eq(notifications.recipientId, params.recipientId))
			.orderBy(desc(notifications.createdAt))
			.limit(params.limit)
			.offset(params.offset);
	},

	async countByRecipient(recipientId: string): Promise<number> {
		const [result] = await db
			.select({ total: count() })
			.from(notifications)
			.where(eq(notifications.recipientId, recipientId));

		return result?.total ?? 0;
	},

	async create(input: CreateNotificationInput): Promise<NotificationRecord> {
		const [notification] = await db
			.insert(notifications)
			.values(input)
			.returning();

		return notification;
	},

	async deleteByRecipient(recipientId: string): Promise<number> {
		const deleted = await db
			.delete(notifications)
			.where(eq(notifications.recipientId, recipientId))
			.returning({ id: notifications.id });

		return deleted.length;
	},

	async markAsRead(id: string): Promise<NotificationRecord | null> {
		const [notification] = await db
			.update(notifications)
			.set({ read: true, updatedAt: new Date() })
			.where(eq(notifications.id, id))
			.returning();

		return notification ?? null;
	},
};
