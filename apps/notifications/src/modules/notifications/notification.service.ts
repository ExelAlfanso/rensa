import { redis, redisConnected } from "../../utils/redis";
import { UserRepository } from "../users/user.repository";
import { WebSocketService } from "../websocket/websocket.service";
import {
	isNotificationType,
	type NotificationRecord,
	type NotificationResponse,
} from "./notification.model";
import { NotificationRepository } from "./notification.repository";

class NotificationServiceError extends Error {
	success = false;

	constructor(message: string) {
		super(message);
		this.name = "NotificationServiceError";
	}
}

function getNotificationKey(notification: NotificationRecord) {
	return `notifications:${notification.recipientId}:${notification.actorId}:${notification.photoId}:${notification.type}`;
}

async function checkNotificationKey(notificationKey: string) {
	if (!redisConnected()) {
		console.warn("Redis not connected, skipping duplicate check");
		return false;
	}

	const exists = await redis.get(notificationKey);
	return exists !== null;
}

async function setNotificationKey(notificationKey: string) {
	if (!redisConnected()) {
		console.warn("Redis not connected, skipping key set");
		return false;
	}

	await redis.set(notificationKey, "1", "EX", 60);
	return true;
}

async function populateNotificationActor(
	notification: NotificationRecord
): Promise<NotificationResponse> {
	const actor = await UserRepository.findPublicById(notification.actorId);

	return {
		...notification,
		actorId: actor,
	};
}

export const NotificationService = {
	async fetchNotifications(query: {
		recipientId: string;
		page?: number;
		limit?: number;
	}) {
		const page = Number(query.page) || 1;
		const limit = Number(query.limit) || 10;
		const offset = (page - 1) * limit;

		const [notifications, total] = await Promise.all([
			NotificationRepository.findByRecipient({
				recipientId: query.recipientId,
				limit,
				offset,
			}),
			NotificationRepository.countByRecipient(query.recipientId),
		]);

		const populatedNotifications = await Promise.all(
			notifications.map((notification) =>
				populateNotificationActor(notification)
			)
		);

		return {
			success: true,
			status: 200,
			message: "Notifications fetched",
			data: {
				notifications: populatedNotifications,
				page,
				total,
				hasMore: page * limit < total,
			},
		};
	},

	async clearNotifications(userId: string) {
		if (!userId) {
			return {
				success: false,
				status: 400,
				message: "userId is required",
			};
		}

		const deletedCount = await NotificationRepository.deleteByRecipient(userId);

		return {
			success: true,
			status: 200,
			message: "Notifications cleared",
			data: { deletedCount },
		};
	},

	async notify(params: {
		actorId: string;
		recipientId: string;
		photoId: string;
		type: string;
	}) {
		const { actorId, recipientId, photoId, type } = params;

		if (actorId === recipientId) {
			throw new NotificationServiceError("Cannot notify yourself");
		}

		if (!(actorId && recipientId && photoId)) {
			throw new NotificationServiceError("Missing required fields");
		}

		if (!isNotificationType(type)) {
			throw new NotificationServiceError("Invalid notification type");
		}

		const notification = await NotificationRepository.create({
			actorId,
			recipientId,
			photoId,
			type,
		});

		const key = getNotificationKey(notification);
		const isDuplicate = await checkNotificationKey(key);

		if (!isDuplicate) {
			await setNotificationKey(key);
			const populatedNotification =
				await populateNotificationActor(notification);
			WebSocketService.sendNotification(populatedNotification);
		}

		return {
			success: true,
			message: `Notification created (${type})`,
			data: { notification },
		};
	},

	async markNotificationAsRead(notificationId: string) {
		const notification =
			await NotificationRepository.markAsRead(notificationId);

		if (!notification) {
			return {
				success: false,
				status: 404,
				message: "Notification not found",
			};
		}

		return {
			success: true,
			status: 200,
			message: "Notification marked as read",
			data: { notification },
		};
	},
};
