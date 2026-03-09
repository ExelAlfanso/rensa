"use client";
import { NotificationProvider } from "@/frontend/providers/NotificationProvider";

export default function NotificationProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
