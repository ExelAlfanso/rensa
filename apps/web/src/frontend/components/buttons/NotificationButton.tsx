"use client";

import { BellIcon } from "@phosphor-icons/react";
import type React from "react";
import { cn } from "@/utils/cn";

interface NotificationButtonProps {
	className?: string;
	id?: string;
	onClick?: () => void;
	popoverTarget: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
	id,
	className,
	popoverTarget,
	onClick,
}) => (
	<button
		className={cn(
			"btn cursor-pointer border-0 bg-transparent text-primary outline-0 ring-0 transition-colors duration-300 hover:text-gray-800",
			className
		)}
		id={id}
		onClick={onClick}
		popoverTarget={popoverTarget}
		style={{ anchorName: "--anchor-1" } as React.CSSProperties}
		type="button"
	>
		<BellIcon size={32} weight="fill" />
	</button>
);

export default NotificationButton;
