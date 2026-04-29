interface Passthrough {
	[key: string]: unknown;
}

export interface NotificationActorDto extends Passthrough {
	avatar: string;
	id: string;
	username: string;
}

export interface NotificationResponseDto extends Passthrough {
	actorId: NotificationActorDto;
	createdAt?: Date | string;
	id: string;
	message: string;
	photoId: string;
	read: boolean;
	recipientId: string;
	type: string;
	updatedAt?: Date | string;
}

export interface ListNotificationsQueryDto {
	limit: number;
	page: number;
	recipientId: string;
}

export interface CreateNotificationDto {
	actorId: string;
	photoId: string;
	recipientId: string;
	type: string;
}

export interface NotificationRepositoryInterface {
	clearByUserId(userId: string): Promise<void>;
	create(payload: CreateNotificationDto): Promise<unknown>;
	list(query: ListNotificationsQueryDto): Promise<NotificationResponseDto[]>;
	markAsRead(notificationId: string): Promise<void>;
}
