import Link from "next/link";
import type React from "react";
import { cn } from "@/utils/cn";
import type { ButtonProps } from "./Button";

const AccentButton: React.FC<ButtonProps> = ({
	id,
	className,
	children,
	href,
	onClick,
	disabled,
	type,
}) => {
	const baseClasses = cn(
		"btn flex h-[29px] gap-1 rounded-[10px] border-0 bg-gray-100 p-0 px-3 font-semibold text-[12px] text-primary outline-0 ring-0 hover:bg-gray-200 md:text-[16px]",
		className
	);

	if (href && !disabled) {
		return (
			<Link href={href}>
				<div className={baseClasses}>{children}</div>
			</Link>
		);
	}
	return (
		<button
			className={baseClasses}
			disabled={disabled}
			id={id}
			onClick={onClick}
			type={type}
		>
			{children}
		</button>
	);
};

export default AccentButton;
