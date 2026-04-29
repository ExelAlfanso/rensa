"use client";

import Link from "next/link";
import type React from "react";

interface LinkIconButtonViewProps {
	children?: React.ReactNode;
	className?: string;
	href: string;
	Icon: React.ElementType;
	onClick?: (e: React.MouseEvent) => void;
}

const LinkIconButtonView: React.FC<LinkIconButtonViewProps> = ({
	href,
	className,
	onClick,
	children,
	Icon,
}) => (
	<Link className={className} href={href} onClick={onClick}>
		{Icon && <Icon className="text-primary hover:text-black-200" size={32} />}
		{children}
	</Link>
);

export default LinkIconButtonView;
