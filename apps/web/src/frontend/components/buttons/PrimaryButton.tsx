import type React from "react";
import Button, { type ButtonProps } from "./Button";

const PrimaryButton: React.FC<ButtonProps> = ({
	id,
	className,
	href,
	children,
	onClick,
	type,
	disabled,
}) => {
	return (
		<Button
			className={`bg-black-500 text-white hover:bg-black-300 focus:bg-black-400 disabled:bg-black-200 ${className}`}
			disabled={disabled}
			href={href}
			id={id}
			onClick={onClick}
			type={type}
		>
			{children}
		</Button>
	);
};

export default PrimaryButton;
