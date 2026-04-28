import type { NotificationResponse } from "../notifications/notification.model";

export type AuthenticatedWebSocket = {
  data: {
    jwt: {
      verify: (token: string) => Promise<any>;
    };
    query: {
      token: string;
    };
    userId?: string;
  };
  send: (message: string) => void;
};

export type WebSocketNotificationPayload = NotificationResponse;
