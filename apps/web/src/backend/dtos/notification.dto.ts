import { z } from "zod";
import { paginationQueryDto } from "./common.dto";

const notificationActorDto = z
	.object({
		id: z.string().min(1),
		username: z.string().min(1),
		avatar: z.string(),
	})
	.passthrough();

export const notificationResponseDto = z
	.object({
		id: z.string().min(1),
		recipient_id: z.string().min(1),
		actor_id: notificationActorDto,
		photo_id: z.string().min(1),
		type: z.string().min(1),
		read: z.boolean(),
		message: z.string(),
		created_at: z.union([z.string(), z.date()]).optional(),
		updated_at: z.union([z.string(), z.date()]).optional(),
	})
	.passthrough();

export const listNotificationsQueryDto = paginationQueryDto
	.extend({
		recipient_id: z.string().min(1).optional(),
		recipientId: z.string().min(1).optional(),
	})
	.refine((value) => value.recipient_id ?? value.recipientId, {
		message: "recipient_id is required",
	})
	.transform((value) => ({
		limit: value.limit,
		page: value.page,
		recipient_id: (value.recipient_id ?? value.recipientId) as string,
	}));

export const createNotificationDto = z
	.object({
		actor_id: z.string().min(1).optional(),
		actorId: z.string().min(1).optional(),
		recipient_id: z.string().min(1).optional(),
		recipientId: z.string().min(1).optional(),
		photo_id: z.string().min(1).optional(),
		photoId: z.string().min(1).optional(),
		type: z.string().min(1),
	})
	.refine((value) => value.actor_id ?? value.actorId, {
		message: "actor_id is required",
	})
	.refine((value) => value.recipient_id ?? value.recipientId, {
		message: "recipient_id is required",
	})
	.refine((value) => value.photo_id ?? value.photoId, {
		message: "photo_id is required",
	})
	.transform((value) => ({
		actor_id: (value.actor_id ?? value.actorId) as string,
		recipient_id: (value.recipient_id ?? value.recipientId) as string,
		photo_id: (value.photo_id ?? value.photoId) as string,
		type: value.type,
	}));

export const notificationIdParamDto = z.object({
	id: z.string().min(1),
});

export type NotificationResponseDto = z.infer<typeof notificationResponseDto>;
export type ListNotificationsQueryDto = z.infer<
	typeof listNotificationsQueryDto
>;
export type CreateNotificationDto = z.infer<typeof createNotificationDto>;
