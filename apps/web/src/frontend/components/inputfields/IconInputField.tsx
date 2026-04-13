"use client";

import type React from "react";

interface IconInputFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	containerClassName?: string;
	Icon: React.ElementType;
	iconPosition?: "left" | "right";
	label?: string;
}

const IconInputField: React.FC<IconInputFieldProps> = ({
	Icon,
	iconPosition = "left",
	label,
	containerClassName = "",
	className = "",
	...props
}) => {
	return (
		<div className={`relative w-full ${containerClassName}`}>
			{label && (
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					{label}
				</label>
			)}

			<Icon
				className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-black-400 ${
					iconPosition === "left" ? "left-5" : "right-8"
				}`}
				size={20}
			/>

			<input
				{...props}
				className={`h-[36px] rounded-3xl bg-gray-200 font-figtree text-[16px] text-black transition-colors duration-200 placeholder:text-black-300 focus:border focus:border-black-200 focus:bg-[#FAFAFA] focus:outline-none md:h-[42px] md:py-4 ${iconPosition === "left" ? "pr-4 pl-12" : "pr-12 pl-5"} 
          ${className}`}
			/>
		</div>
	);
};

export default IconInputField;
