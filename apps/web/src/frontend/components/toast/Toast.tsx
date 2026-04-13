"use client";

import { AnimatePresence, motion } from "motion/react";
import { useToast } from "@/frontend/providers/ToastProvider";
import { cn } from "@/utils/cn";

export default function Toast() {
	const { toasts } = useToast();

	return (
		<div className="fixed bottom-6 left-1/2 z-9999 flex -translate-x-1/2 flex-col items-center gap-3 font-figtree">
			{toasts.map((toast) => (
				<AnimatePresence key={toast.id}>
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className={cn(
							"rounded-xl px-4 py-3 text-white shadow-lg",
							toast.type === "success"
								? "bg-black-400"
								: toast.type === "error"
									? "bg-error"
									: "bg-black-600"
						)}
						exit={{ opacity: 0, y: 10 }}
						initial={{ opacity: 0, y: 10 }}
					>
						{toast.message}
					</motion.div>
				</AnimatePresence>
			))}
		</div>
	);
}
