import type React from "react";
import { cn } from "@/utils/cn";

interface LoadingOverlayProps {
	className?: string;
	id?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ id, className }) => {
	return (
		<div
			className={cn(
				"fixed inset-0 z-50 flex items-center justify-center bg-white",
				className
			)}
		>
			<div
				className="loading loading-spinner loading-xl text-primary"
				id={id}
			/>
		</div>
	);
};

export default LoadingOverlay;
