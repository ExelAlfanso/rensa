import type {
	CreateNotificationDto,
	ListNotificationsQueryDto,
	NotificationResponseDto,
} from "@rensa/db/schema";
import { NotificationRepository } from "@rensa/db/queries/notification.repository";
import { elysiaApi } from "@/lib/axios-server";
import { NotificationService } from "./service";

export class NotificationsController {
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

const notificationRepository = new NotificationRepository(elysiaApi);
const notificationService = new NotificationService(notificationRepository);

export const notificationController = new NotificationsController(
	notificationService
);

