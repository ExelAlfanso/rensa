import type {
	CreateNotificationDto,
	ListNotificationsQueryDto,
	NotificationResponseDto,
} from "../dtos/notification.dto";

export interface NotificationRepositoryInterface {
	clearByUserId(userId: string): Promise<void>;
	create(payload: CreateNotificationDto): Promise<unknown>;
	list(query: ListNotificationsQueryDto): Promise<NotificationResponseDto[]>;
	markAsRead(notificationId: string): Promise<void>;
}
