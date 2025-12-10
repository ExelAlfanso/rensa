"use client";

import { fetchNotifications } from "@/services/NotificationServices";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useRef } from "react";

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
    enabled: !!accessToken,
    initialData: [],
  });

  // useEffect(() => {
  //   if (notifications.length > 0) {
  //     console.log("✅ Notifications fetched:", notifications);
  //   } else {
  //     console.log("ℹ️ No notifications found.");
  //   }
  // }, [notifications]);
  const connectWebSocket = () => {
    const WS_URL =
      process.env.NEXT_PUBLIC_ENVIRONMENT === "DEVELOPMENT"
        ? "ws://localhost:4000/api/ws"
        : process.env.NEXT_PUBLIC_ELYSIA_WS_URL;
    const ws = new WebSocket(`${WS_URL}?token=${accessToken}`);
    wsRef.current = ws;

    ws.onopen = () => {
      // console.log("Connecting to WS at", WS_URL);
      // console.log("📡 WebSocket connected!");
      reconnectAttempts.current = 0; // reset reconnect attempts
    };

    ws.onmessage = async (event) => {
      // console.log("📩 WS Message received:", event.data);
      try {
        const data = JSON.parse(event.data);
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
    };

    ws.onerror = (err) => console.error("WS Error:", err);

    ws.onclose = () => {
      // console.log("❌ WebSocket disconnected");

      const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000); // exponential backoff
      reconnectAttempts.current += 1;
      // console.log(`🔄 Reconnecting in ${delay / 1000}s...`);

      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);

      reconnectTimeout.current = setTimeout(() => {
        connectWebSocket();
      }, delay);
    };
  };
  useEffect(() => {
    if (!user?.id || !accessToken) {
      // console.log("No token, skipping WebSocket");
      return;
    }
    // else {
    //   console.log("Token found, connecting WebSocket" + accessToken);
    // }

    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [user?.id, accessToken]);

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
