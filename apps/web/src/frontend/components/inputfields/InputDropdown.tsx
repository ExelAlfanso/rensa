import { CaretDownIcon } from "@phosphor-icons/react";
import type React from "react";
import { useState } from "react";
import { useOutsideClick } from "@/frontend/hooks/use-outside-click";
import Text from "../Text";

interface InputDropdownProps {
	initialValue?: string | number | object;
	label?: string;
	onChange?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	placeholder?: string;
	values?: string[];
}

const InputDropdown: React.FC<InputDropdownProps> = ({
	values,
	label,
	placeholder,
	initialValue,
	onChange,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));
	const [value, setValue] = useState<string>((initialValue as string) || "");
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.currentTarget;
		setValue(target.innerText);
		onChange?.(e);
		setIsOpen(false);
	};
	return (
		<div className="relative w-full text-primary" ref={dropdownRef}>
			{label && (
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					{label}
				</label>
			)}
			<button
				className={`w-full bg-gray-200 px-4 py-2 text-left ${
					value ? "text-black" : "text-gray-800"
				} cursor-pointer rounded-3xl outline-0 ring-0 hover:bg-gray-300`}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<Text size="m">{value || placeholder || "Select an option"}</Text>
			</button>

			<div
				className={`absolute top-12 z-10 origin-top rounded-2xl border border-gray-500 bg-white-200 transition-transform duration-300 ${
					isOpen ? "scale-y-100" : "scale-y-0"
				} ${(values?.length ?? 0) > 6 ? "grid grid-cols-2" : "flex flex-col"}`}
			>
				{values?.map((val, index) => (
					<button
						className="cursor-pointer px-4 py-2 text-left text-primary hover:bg-gray-100"
						key={index}
						onClick={(e) => handleClick(e)}
					>
						{val}
					</button>
				))}
			</div>
			<button
				className="absolute top-1/2 right-3 cursor-pointer"
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

export default InputDropdown;
