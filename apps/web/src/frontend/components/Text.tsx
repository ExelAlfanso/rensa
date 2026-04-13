import type React from "react";
import { cn } from "@/utils/cn";

interface TextProps {
	children?: React.ReactNode;
	className?: string;
	id?: string;
	size?: "xs" | "s" | "m" | "l" | "xl" | "xxl";
}

const Text: React.FC<TextProps> = ({
	id,
	className,
	children,
	size = "xl",
}) => {
	const sizeClasses = {
		xs: "text-[10px] md:text-[13px]",
		s: "text-[13px] md:text-[18px]",
		m: "text-[16px] md:text-[18px]",
		l: "text-[18px] md:text-[20px]",
		xl: "text-[20px] md:text-[24px]",
		xxl: "text-[24px] md:text-[30px]",
	};
	return (
		<div className={cn("font-figtree", sizeClasses[size], className)} id={id}>
			{children}
		</div>
	);
};

export default Text;
