"use client";

import { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
	duration?: number;
	id: string;
	message: string;
	type?: ToastType;
}

interface ToastContextProps {
	removeToast: (id: string) => void;
	showToast: (message: string, type?: ToastType, duration?: number) => void;
	toasts: Toast[];
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) {
		throw new Error("useToast must be used inside ToastProvider");
	}
	return ctx;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);
	const showToast = useCallback(
		(message: string, type: ToastType = "info", duration = 3000) => {
			const id =
				typeof crypto !== "undefined" && crypto.randomUUID
					? crypto.randomUUID()
					: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
			const toast: Toast = { id, message, type, duration };
			setToasts((prev) => [...prev, toast]);

			// auto remove
			setTimeout(() => removeToast(id), duration);
		},
		[removeToast]
	);

	return (
		<ToastContext.Provider value={{ toasts, showToast, removeToast }}>
			{children}
		</ToastContext.Provider>
	);
};
