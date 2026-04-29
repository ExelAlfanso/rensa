import type {
	AuthenticatedWebSocket,
	WebSocketNotificationPayload,
} from "./websocket.model";

export const onlineUsers = new Map<string, AuthenticatedWebSocket>();

class WebSocketAuthError extends Error {
	success = false;

	constructor(message: string) {
		super(message);
		this.name = "WebSocketAuthError";
	}
}

export const WebSocketService = {
	async open(ws: AuthenticatedWebSocket) {
		const token = ws.data.query.token;
		const payload = await ws.data.jwt.verify(token);

		if (!payload?.id) {
			throw new WebSocketAuthError("WebSocket authentication failed");
		}

		ws.data.userId = payload.id;
		WebSocketService.registerUser(payload.id, ws);

		console.log(`User ${payload.id} connected`);
	},

	close(ws: AuthenticatedWebSocket) {
		const userId = ws.data.userId;
		if (!userId) {
			return;
		}

		WebSocketService.removeUser(userId);
		console.log(`User ${userId} disconnected`);
	},

	registerUser(userId: string, ws: AuthenticatedWebSocket) {
		onlineUsers.set(userId, ws);
	},

	removeUser(userId: string) {
		onlineUsers.delete(userId);
	},

	sendNotification(notification: WebSocketNotificationPayload) {
		const ws = onlineUsers.get(notification.recipientId);
		if (!ws) {
			return;
		}

		ws.send(
			JSON.stringify({
				id: notification.id,
				recipientId: notification.recipientId,
				actorId: notification.actorId,
				photoId: notification.photoId,
				type: notification.type,
				read: notification.read,
				createdAt: notification.createdAt,
			})
		);
	},
};
