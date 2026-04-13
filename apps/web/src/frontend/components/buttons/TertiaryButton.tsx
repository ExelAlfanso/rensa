import type React from "react";
import Button, { type ButtonProps } from "./Button";

const TertiaryButton: React.FC<ButtonProps> = ({
	id,
	className,
	children,
	href,
	onClick,
	type,
}) => {
	return (
		<Button
			className={`btn-ghost border-1 border-primary text-primary hover:border-white-600 hover:bg-transparent hover:text-black-200 ${className}`}
			href={href}
			id={id}
			onClick={onClick}
			type={type}
		>
			{children}
		</Button>
	);
};

export default TertiaryButton;
