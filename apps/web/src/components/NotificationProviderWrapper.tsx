"use client";
import { NotificationProvider } from "@/providers/NotificationProvider";

export default function NotificationProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
