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
		recipientId: z.string().min(1),
		actorId: notificationActorDto,
		photoId: z.string().min(1),
		type: z.string().min(1),
		read: z.boolean(),
		message: z.string(),
		createdAt: z.union([z.string(), z.date()]).optional(),
		updatedAt: z.union([z.string(), z.date()]).optional(),
	})
	.passthrough();

export const listNotificationsQueryDto = paginationQueryDto.extend({
	recipientId: z.string().min(1),
});

export const createNotificationDto = z.object({
	actorId: z.string().min(1),
	recipientId: z.string().min(1),
	photoId: z.string().min(1),
	type: z.string().min(1),
});

export const notificationIdParamDto = z.object({
	id: z.string().min(1),
});

export type NotificationResponseDto = z.infer<typeof notificationResponseDto>;
export type ListNotificationsQueryDto = z.infer<
	typeof listNotificationsQueryDto
>;
export type CreateNotificationDto = z.infer<typeof createNotificationDto>;

