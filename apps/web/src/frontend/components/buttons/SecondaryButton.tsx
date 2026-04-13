import type React from "react";
import Button, { type ButtonProps } from "./Button";

const SecondaryButton: React.FC<ButtonProps> = ({
	id,
	className,
	href,
	children,
	onClick,
	type,
}) => {
	return (
		<Button
			className={`btn-secondary text-white hover:bg-orange-300 focus:bg-orange-700 ${className}`}
			href={href}
			id={id}
			onClick={onClick}
			type={type}
		>
			{children}
		</Button>
	);
};

export default SecondaryButton;
