import { AxiosError } from "axios";
import type {
	CreateNotificationDto,
	ListNotificationsQueryDto,
	NotificationResponseDto,
} from "@/backend/dtos/notification.dto";
import type { NotificationRepositoryInterface } from "@/backend/interfaces/notification-repository.interface";
import { elysiaApi } from "@/lib/axios-server";

interface NotificationsApiResponse {
	data?: {
		notifications?: NotificationResponseDto[];
	};
}

export class NotificationRepository implements NotificationRepositoryInterface {
	async list(
		query: ListNotificationsQueryDto
	): Promise<NotificationResponseDto[]> {
		try {
			const response = await elysiaApi.get<NotificationsApiResponse>(
				"/notifications",
				{
					params: query,
				}
			);
			return response.data.data?.notifications ?? [];
		} catch (error) {
			throw this.mapAxiosError(error, "Failed to fetch notifications");
		}
	}

	async create(payload: CreateNotificationDto): Promise<unknown> {
		try {
			const response = await elysiaApi.post("/notifications", payload);
			return response.data;
		} catch (error) {
			throw this.mapAxiosError(error, "Failed to create notification");
		}
	}

	async markAsRead(notificationId: string): Promise<void> {
		try {
			await elysiaApi.put(`/notifications/${notificationId}/read`);
		} catch (error) {
			throw this.mapAxiosError(error, "Failed to mark notification as read");
		}
	}

	async clearByUserId(userId: string): Promise<void> {
		try {
			await elysiaApi.delete(`/notifications/${userId}`);
		} catch (error) {
			throw this.mapAxiosError(error, "Failed to clear notifications");
		}
	}

	private mapAxiosError(error: unknown, fallbackMessage: string): Error {
		if (error instanceof AxiosError) {
			const responseMessage =
				typeof error.response?.data?.message === "string"
					? error.response.data.message
					: null;
			return new Error(responseMessage ?? error.message ?? fallbackMessage);
		}
		return new Error(fallbackMessage);
	}
}
