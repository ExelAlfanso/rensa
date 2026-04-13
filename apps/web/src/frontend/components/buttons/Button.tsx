import Link from "next/link";
import type React from "react";

export interface ButtonProps {
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	href?: string;
	id?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	paddingX?: number;
	type?: "submit" | "button";
}

const Button: React.FC<ButtonProps> = ({
	id,
	className,
	href,
	children,
	onClick,
	paddingX = 6,
	type,
	disabled,
}) => {
	if (href && !disabled) {
		return (
			<Link href={href}>
				<div
					className={`btn flex h-8 rounded-[50px] border-0 font-semibold text-[12px] outline-0 ring-0 md:h-12 md:text-[16px] ${className} px-${paddingX} gap-1}`}
				>
					{children}
				</div>
			</Link>
		);
	}
	return (
		<button
			className={`btn flex h-8 rounded-[50px] border-0 font-semibold text-[12px] outline-0 ring-0 md:h-12 md:text-[16px] ${className} px-${paddingX} gap-1`}
			disabled={disabled}
			id={id}
			onClick={onClick}
			type={type}
		>
			{children}
		</button>
	);
};

export default Button;
