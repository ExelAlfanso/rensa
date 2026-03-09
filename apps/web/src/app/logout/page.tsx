"use client";

import LoadingOverlay from "@/frontend/components/LoadingOverlay";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Logout() {
  const { clearAuth } = useAuthStore();
  useEffect(() => {
    clearAuth();
    signOut({ callbackUrl: "/login" });
  }, [clearAuth]);

  return <LoadingOverlay />;
}
