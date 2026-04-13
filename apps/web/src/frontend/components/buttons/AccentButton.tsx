import Link from "next/link";
import type React from "react";
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
	const baseClasses = `btn flex border-0 outline-0 ring-0 h-[29px] rounded-[10px] text-[12px] md:text-[16px] font-semibold ${className} px-3 p-0 bg-gray-100 hover:bg-gray-200 text-primary gap-1`;

	if (href && !disabled) {
		return (
			<Link href={href}>
				<div className={`${baseClasses}`}>{children}</div>
			</Link>
		);
	}
	return (
		<button
			className={`${baseClasses} `}
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
