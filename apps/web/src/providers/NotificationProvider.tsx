"use client";

import { fetchNotifications } from "@/services/NotificationServices";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

interface NotificationData {
  id: string;
  recipientId: string;
  actorId: {
    id: string;
    username: string;
    avatar: string;
  };
  photoId: string;
  type: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NotificationContextType {
  notifications: NotificationData[];
  clearNotifications: () => void;
  refetch: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const { user, accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const { data: notifications = [], refetch } = useQuery<NotificationData[]>({
    queryKey: ["notifications", user?.id],
    queryFn: () => fetchNotifications(user!.id),
    enabled: !!accessToken && !!user?.id,
    initialData: [],
  });

  const connectWebSocket = useCallback(() => {
    const WS_URL =
      process.env.NEXT_PUBLIC_ENVIRONMENT === "DEVELOPMENT"
        ? "ws://localhost:4000/api/ws"
        : process.env.NEXT_PUBLIC_ELYSIA_WS_URL;
    if (!WS_URL) {
      console.error("WebSocket URL is not configured");
      return;
    }
    const ws = new WebSocket(`${WS_URL}?token=${accessToken}`);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttempts.current = 0;
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.id || !data.recipientId || !data.type) {
          console.warn("Invalid notification data received:", data);
          return;
        }
        queryClient.setQueryData<NotificationData[]>(
          ["notifications", user?.id],
          (oldNotifications = []) => {
            const newList = [data, ...oldNotifications];
            return newList.slice(0, 10);
          }
        );
      } catch (err) {
        console.error("Invalid WS message:", err);
      }

      ws.onerror = (err) => console.error("WS Error:", err);

      ws.onclose = () => {
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000); // exponential backoff
        reconnectAttempts.current += 1;

        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);

        reconnectTimeout.current = setTimeout(() => {
          connectWebSocket();
        }, delay);
      };
    };
  }, [accessToken, queryClient, user?.id]);
  useEffect(() => {
    if (!user?.id || !accessToken) {
      return;
    }
    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [user?.id, accessToken, connectWebSocket]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        clearNotifications: () =>
          queryClient.setQueryData(["notifications", user?.id], []),
        refetch,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("NotificationProvider not found");
  return ctx;
};
