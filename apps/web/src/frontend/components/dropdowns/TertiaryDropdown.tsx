"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import type React from "react";
import { useState } from "react";
import { useOutsideClick } from "@/frontend/hooks/use-outside-click";
import TertiaryButton from "../buttons/TertiaryButton";
import Text from "../Text";

interface TertiaryDropdownProps {
	className?: string;
	initialValue: string;
	label?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	values: string[];
}

const TertiaryDropdown: React.FC<TertiaryDropdownProps> = ({
	values,
	label,
	placeholder,
	initialValue,
	onChange,
	className,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));
	const [value, setValue] = useState<string>(initialValue);
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.currentTarget;
		setValue(target.innerText);
		onChange?.(target.innerText);
		setIsOpen(false);
	};
	return (
		<div className={`relative ${className} text-primary`} ref={dropdownRef}>
			{label && (
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					{label}
				</label>
			)}
			<TertiaryButton
				className="w-full"
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<Text size="m">{value || placeholder || "Select an option"}</Text>
			</TertiaryButton>
			<div
				className={`absolute left-0 z-10 mt-2 w-full origin-top transform rounded-2xl border border-gray-300 bg-white shadow-md transition-transform duration-200 ease-out ${isOpen ? "scale-y-100" : "scale-y-0"}
              ${
								(values?.length ?? 0) > 6 ? "grid grid-cols-2" : "flex flex-col"
							}`}
			>
				{values?.map((val, index) => (
					<button
						className="cursor-pointer px-4 py-2 text-left font-semibold text-primary hover:bg-gray-100"
						key={index}
						onClick={(e) => handleClick(e)}
					>
						{val}
					</button>
				))}
			</div>
			<button
				className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer"
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen((prev) => !prev);
				}}
				type="button"
			>
				<CaretDownIcon
					className="transition-colors duration-200 hover:text-orange-500"
					size={20}
				/>
			</button>
		</div>
	);
};

export default TertiaryDropdown;
