import type React from "react";
import { cn } from "@/utils/cn";
import Button, { type ButtonProps } from "./Button";

const SecondaryButton: React.FC<ButtonProps> = ({
	id,
	className,
	href,
	children,
	onClick,
	type,
}) => (
	<Button
		className={cn(
			"btn-secondary text-white hover:bg-orange-300 focus:bg-orange-700",
			className
		)}
		href={href}
		id={id}
		onClick={onClick}
		type={type}
	>
		{children}
	</Button>
);

export default SecondaryButton;
