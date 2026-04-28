"use client";

import type React from "react";
import { cn } from "@/utils/cn";

interface SmallIconButtonProps {
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

const SmallIconButton: React.FC<SmallIconButtonProps> = ({
	onClick,
	className,
	disabled,
	children,
}) => {
	const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();
		onClick(e);
	};
	return (
		<button
			className={cn(
				"cursor-pointer rounded-full text-black transition-opacity duration-300 hover:bg-white-700",
				className
			)}
			disabled={disabled}
			onClick={onClickHandler}
			type="button"
		>
			{children}
		</button>
	);
};

export default SmallIconButton;
