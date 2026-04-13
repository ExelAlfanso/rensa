"use client";
import type React from "react";
import { cn } from "@/utils/cn";
import Text from "../Text";

// import "./InputField.css";
// DEPRECATED: Use BaseInputField instead
interface InputFieldProps {
	className?: string;
	disabled?: boolean;
	Icon?: React.ElementType;
	iconPosition?: "left" | "right";
	label?: string;
	name?: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	placeholder?: string;
	size?: "m" | "l" | "xl" | "xxl";
	type: string;
	value?: string | number | object;
}

const InputField: React.FC<InputFieldProps> = ({
	type,
	placeholder,
	size = "l",
	name,
	label,
	className,
	disabled,
	Icon,
	value,
	iconPosition = "right",
	onChange,
	onKeyDown,
}) => {
	const sizeClasses = {
		m: "h-10 md:h-12 md:py-3",
		l: "h-12 md:h-16 md:py-4",
		xl: "h-20 md:h-20 md:py-5",
		xxl: "h-24 md:h-24 md:pt-6 md:pb-20",
	};
	const defaultStyling =
		"w-full bg-gray-200 text-[16px] md:text-[18px] focus:outline-0 focus:ring-0 focus:border focus:border-gray-800 text-black focus:bg-white-500 disabled:text-gray-300 disabled:border-gray-200 disabled:bg-white-500 rounded-3xl placeholder:text-primary pl-6 pr-4";
	return (
		<>
			{label && (
				<label className={"text-left"}>
					<Text className="text-gray-700" size="m">
						{label}
					</Text>
				</label>
			)}
			{!Icon && type !== "textarea" && (
				<input
					className={cn(defaultStyling, sizeClasses[size], className)}
					disabled={disabled}
					name={name}
					onChange={onChange}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					type={type}
					value={value as string | number | undefined}
				/>
			)}

			{type === "textarea" && (
				<textarea
					className={cn(defaultStyling, sizeClasses[size], className)}
					disabled={disabled}
					name={name}
					onChange={onChange}
					placeholder={placeholder}
					rows={6}
					value={value as string | number | undefined}
				/>
			)}

			{Icon && (
				<div className="relative flex items-center">
					<input
						className={cn(
							defaultStyling,
							iconPosition === "left" ? "pl-11" : "pl-6",
							sizeClasses[size],
							className
						)}
						disabled={disabled}
						name={name}
						onChange={onChange}
						onKeyDown={onKeyDown}
						placeholder={placeholder}
						type={type}
						value={value as string | number | undefined}
					/>
					<div
						className={cn(
							"absolute inset-y-0 flex cursor-pointer items-center text-black",
							iconPosition === "left" ? "left-0 pl-5" : "right-0 pr-5"
						)}
					>
						<Icon size={20} />
					</div>
				</div>
			)}
		</>
	);
};

export default InputField;
