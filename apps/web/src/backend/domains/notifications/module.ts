import { NotificationService } from "./application/notification.service";
import { NotificationsApplication } from "./application/notifications.application";
import { notificationsInfrastructure } from "./infrastructure/notifications.repositories";

const notificationsApplication = new NotificationsApplication(
	new NotificationService(notificationsInfrastructure.notificationRepository)
);

export const notificationDomain = {
	...notificationsInfrastructure,
	notificationsApplication,
};
