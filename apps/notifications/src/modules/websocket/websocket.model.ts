import type { NotificationResponse } from "../notifications/notification.model";

export interface WebSocketJwtPayload {
	id?: string;
}

export interface AuthenticatedWebSocket {
	data: {
		jwt: {
			verify: (token: string) => Promise<WebSocketJwtPayload | false>;
		};
		query: {
			token: string;
		};
		userId?: string;
	};
	send: (message: string) => void;
}

export type WebSocketNotificationPayload = NotificationResponse;
