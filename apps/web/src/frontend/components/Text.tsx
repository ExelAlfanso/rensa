import type React from "react";
import { cn } from "@/utils/cn";

interface TextProps {
	as?: "em" | "label" | "p" | "small" | "span" | "strong";
	children?: React.ReactNode;
	className?: string;
	id?: string;
	size?: "xs" | "s" | "m" | "l" | "xl" | "xxl";
}

const Text: React.FC<TextProps> = ({
	as: Component = "span",
	id,
	className,
	children,
	size = "xl",
}) => {
	const sizeClasses = {
		xs: "type-xs",
		s: "type-s",
		m: "type-m",
		l: "type-l",
		xl: "type-xl",
		xxl: "type-xxl",
	};
	return (
		<Component
			className={cn("font-figtree", sizeClasses[size], className)}
			id={id}
		>
			{children}
		</Component>
	);
};

export default Text;
