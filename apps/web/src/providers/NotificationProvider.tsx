"use client";

import { NotificationData } from "@/models/Notification";
import {
  clearUserNotifications,
  fetchNotifications,
  markUserNotificationAsRead,
} from "@/services/NotificationServices";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

interface NotificationContextType {
  notifications: NotificationData[];
  clearNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
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
    queryFn: async () => await fetchNotifications(user!.id),
    enabled: !!accessToken && !!user?.id,
    initialData: [],
  });
  // useEffect(() => {
  //   console.log(notifications);
  // }, [notifications]);
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
        const delay = Math.min(500 * 2 ** reconnectAttempts.current, 10000); // exponential backoff
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

  const clearNotifications = useCallback(() => {
    if (!user?.id) return;
    clearUserNotifications(user.id);
    queryClient.setQueryData<NotificationData[]>(
      ["notifications", user.id],
      []
    );
  }, [queryClient, user?.id]);

  const markNotificationAsRead = useCallback(
    async (id: string) => {
      if (!user?.id) return;

      const key = ["notifications", user.id];

      const current = queryClient.getQueryData<NotificationData[]>(key) || [];

      const target = current.find((n) => n.id === id);

      // already read → skip
      if (!target || target.read) return;

      // 🔥 optimistic update
      queryClient.setQueryData<NotificationData[]>(key, (old = []) =>
        old.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      try {
        markUserNotificationAsRead(id);
      } catch (err) {
        console.error("Failed to mark notification as read", err);

        // rollback kalau gagal
        queryClient.setQueryData<NotificationData[]>(key, current);
      }
    },
    [queryClient, user?.id]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        clearNotifications,
        markNotificationAsRead,
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
