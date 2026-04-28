import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import type React from "react";
import { useState } from "react";
import BaseInputField from "./BaseInputField";

interface PasswordInputFieldProps {
	name?: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	placeholder?: string;
}

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
	name,
	placeholder,
	onChange,
}) => {
	const [type, setType] = useState("password");

	const handleTogglePassword = () => {
		setType(type === "password" ? "text" : "password");
	};
	return (
		<div className="relative">
			<BaseInputField
				name={name}
				onChange={onChange}
				placeholder={placeholder}
				type={type}
			/>
			<button
				className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-5 text-[25px] text-black md:text-[32px]"
				onClick={handleTogglePassword}
				type="button"
			>
				{type === "password" ? <EyeIcon /> : <EyeClosedIcon />}
			</button>
		</div>
	);
};

export default PasswordInputField;
