import type {
	CreateNotificationDto,
	ListNotificationsQueryDto,
	NotificationResponseDto,
} from "@/backend/dtos/notification.dto";
import type { NotificationService } from "./notification.service";

export class NotificationsApplication {
	private readonly notificationService: NotificationService;

	constructor(notificationService: NotificationService) {
		this.notificationService = notificationService;
	}

	clearByUserId(userId: string): Promise<void> {
		return this.notificationService.clearByUserId(userId);
	}

	create(payload: CreateNotificationDto): Promise<unknown> {
		return this.notificationService.create(payload);
	}

	list(query: ListNotificationsQueryDto): Promise<NotificationResponseDto[]> {
		return this.notificationService.list(query);
	}

	markAsRead(notificationId: string): Promise<void> {
		return this.notificationService.markAsRead(notificationId);
	}
}
