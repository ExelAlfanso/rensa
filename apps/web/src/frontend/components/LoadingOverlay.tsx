import type React from "react";

interface LoadingOverlayProps {
	className?: string;
	id?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ id, className }) => {
	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-white ${className}`}
		>
			<div
				className="loading loading-spinner loading-xl text-primary"
				id={id}
			/>
		</div>
	);
};

export default LoadingOverlay;
