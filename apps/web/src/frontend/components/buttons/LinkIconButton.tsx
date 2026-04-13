"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";

interface LinkIconButtonProps {
	children?: React.ReactNode;
	className?: string;
	href: string;
	Icon: React.ElementType;
	onClick?: () => void;
}

const LinkIconButton: React.FC<LinkIconButtonProps> = ({
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
		} else if (onClick) {
			onClick();
		}
	};

	return (
		<Link
			className={className}
			href={href === "back" ? "#" : href}
			onClick={handleClick}
		>
			{Icon && <Icon className="text-primary hover:text-black-200" size={32} />}
			{children}
		</Link>
	);
};

export default LinkIconButton;
