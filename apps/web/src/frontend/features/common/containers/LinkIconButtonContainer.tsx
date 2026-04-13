"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import LinkIconButtonView from "../components/LinkIconButtonView";

export interface LinkIconButtonContainerProps {
	children?: React.ReactNode;
	className?: string;
	href: string;
	Icon: React.ElementType;
	onClick?: () => void;
}

const LinkIconButtonContainer: React.FC<LinkIconButtonContainerProps> = ({
	href,
	className,
	onClick,
	children,
	Icon,
}) => {
	const router = useRouter();

	const handleClick = (e: React.MouseEvent) => {
		if (href === "back") {
			e.preventDefault();
			router.back();
			return;
		}
		onClick?.();
	};

	return (
		<LinkIconButtonView
			className={className}
			href={href === "back" ? "#" : href}
			Icon={Icon}
			onClick={handleClick}
		>
			{children}
		</LinkIconButtonView>
	);
};

export default LinkIconButtonContainer;
