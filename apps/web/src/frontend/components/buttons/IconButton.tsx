"use client";

import type React from "react";
import Button from "./Button";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import TertiaryButton from "./TertiaryButton";

interface IconButtonProps {
	children?: React.ReactNode;
	className?: string;
	color?: "primary" | "secondary" | "tertiary";
	disabled?: boolean;
	Icon?: React.ElementType;
	iconPosition: "left" | "right" | "center";
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	paddingX?: number;
	ref?: React.Ref<HTMLButtonElement>;
	type?: "submit" | "button";
	weight?: "regular" | "bold";
}

const IconButton: React.FC<IconButtonProps> = ({
	type = "button",
	color = "primary",
	children,
	iconPosition,
	Icon,
	paddingX = 6,
	disabled = false,
	weight = "regular",
	className,
	onClick,
}) => {
	let Tag = Button;
	if (color === "primary") {
		Tag = PrimaryButton;
	}
	if (color === "secondary") {
		Tag = SecondaryButton;
	}
	if (color === "tertiary") {
		Tag = TertiaryButton;
	}
	return (
		<Tag
			className={className}
			disabled={disabled}
			onClick={onClick}
			paddingX={paddingX}
			type={type}
		>
			{iconPosition === "left" && Icon && <Icon size={18} weight={weight} />}
			{children}
			{iconPosition === "right" && Icon && <Icon size={18} weight={weight} />}
		</Tag>
	);
};

export default IconButton;
