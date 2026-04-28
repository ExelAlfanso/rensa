"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import type React from "react";
import { useState } from "react";
import { useOutsideClick } from "@/frontend/features/common/hooks/use-outside-click";
import { cn } from "@/utils/cn";
import Text from "../Text";

interface SearchDropdownProps {
	cameraModels: string[];
	label?: string;
	onSelect: (model: string) => void;
	placeholder?: string;
	value: string;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
	cameraModels,
	value,
	label,
	placeholder,
	onSelect,
}) => {
	const [search, setSearch] = useState(value ?? "");
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

	const filteredModels = cameraModels.filter((m) =>
		m.toLowerCase().includes(String(search).toLowerCase())
	);

	return (
		<div className="relative mt-3 w-full" ref={dropdownRef}>
			{label && (
				<Text className="text-gray-700" size="xs">
					{label}
				</Text>
			)}
			<input
				className="w-full cursor-pointer rounded-3xl bg-gray-200 px-4 py-2 text-left outline-0 ring-0 hover:bg-gray-300"
				onChange={(e) => {
					setSearch(e.target.value);
					setIsOpen(true);
				}}
				onFocus={() => setIsOpen(true)}
				placeholder={placeholder ?? "Search camera model..."}
				type="text"
				value={search}
			/>

			{filteredModels.length > 0 && (
				<div
					className={cn(
						"absolute top-15 z-10 origin-top rounded-2xl border border-gray-500 bg-white-200 transition-transform duration-300",
						isOpen ? "scale-y-100" : "scale-y-0"
					)}
				>
					{/* Scrollable wrapper */}
					<div
						className={cn(
							"max-h-60 overflow-y-auto",
							(filteredModels?.length ?? 0) > 6
								? "grid grid-cols-2"
								: "flex flex-col"
						)}
					>
						{filteredModels.map((model) => (
							<button
								className="cursor-pointer px-3 py-2 text-left hover:bg-gray-100"
								key={model}
								onClick={() => {
									onSelect(model);
									setSearch(model);
									setIsOpen(false);
								}}
							>
								{model}
							</button>
						))}
					</div>
				</div>
			)}
			<button
				className="absolute top-1/2 right-3 cursor-pointer"
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen((prev) => !prev);
				}}
				type="button"
			>
				<CaretDownIcon size={20} />
			</button>
		</div>
	);
};
