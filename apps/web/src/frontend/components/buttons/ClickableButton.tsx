"use client";
import { CaretDownIcon } from "@phosphor-icons/react";

import type React from "react";

interface CaretIconProps {
	children?: React.ReactNode;
	className?: string;
	id?: string;
}

const CaretIcon: React.FC<CaretIconProps> = ({ id, className, children }) => {
	return (
		<div
			className={`cursor-pointer transition-colors duration-300 hover:text-gray-800 ${className}`}
			id={id}
		>
			<CaretDownIcon size={32} />
			{children}
		</div>
	);
};

export default CaretIcon;
