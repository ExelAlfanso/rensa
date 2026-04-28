import { NotificationRepository } from "./notification.repository";

const notificationRepository = new NotificationRepository();

export const notificationsInfrastructure = {
	notificationRepository,
};
