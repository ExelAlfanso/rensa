import type {
  AuthenticatedWebSocket,
  WebSocketNotificationPayload,
} from "./websocket.model";

export const onlineUsers = new Map<string, AuthenticatedWebSocket>();

export class WebSocketService {
  static async open(ws: AuthenticatedWebSocket) {
    const token = ws.data.query.token;
    const payload = await ws.data.jwt.verify(token);

    if (!payload?.id) {
      throw { success: false, message: "WebSocket authentication failed" };
    }

    ws.data.userId = payload.id;
    WebSocketService.registerUser(payload.id, ws);

    console.log(`User ${payload.id} connected`);
  }

  static close(ws: AuthenticatedWebSocket) {
    const userId = ws.data.userId;
    if (!userId) return;

    WebSocketService.removeUser(userId);
    console.log(`User ${userId} disconnected`);
  }

  static registerUser(userId: string, ws: AuthenticatedWebSocket) {
    onlineUsers.set(userId, ws);
  }

  static removeUser(userId: string) {
    onlineUsers.delete(userId);
  }

  static sendNotification(notification: WebSocketNotificationPayload) {
    const ws = onlineUsers.get(notification.recipientId);
    if (!ws) return;

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
  }
}
