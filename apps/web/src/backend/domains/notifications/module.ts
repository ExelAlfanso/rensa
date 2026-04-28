import { NotificationService } from "./application/notification.service";
import { NotificationsApplication } from "./application/notifications.application";
import { notificationsInfrastructure } from "./infrastructure/notifications.repositories";

const notificationService = new NotificationService(
	notificationsInfrastructure.notificationRepository
);
const notificationsApplication = new NotificationsApplication(
	notificationService
);

export const notificationDomain = {
	notificationService,
	notificationsApplication,
};
