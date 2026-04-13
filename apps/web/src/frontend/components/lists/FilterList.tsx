import type React from "react";
import { useEffect, useState } from "react";
import { FilterLists } from "@/frontend/data/filterDatas";
import Text from "../Text";

interface FilterListProps {
	filters: string[];
	handleClearFilters: () => void;
	onFilterChange: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterList: React.FC<FilterListProps> = ({
	onFilterChange,
	filters,
	handleClearFilters,
}) => {
	// local UI state for toggled filters
	const [activeFilters, setActiveFilters] = useState<string[]>(filters);

	// ✅ Sync to parent only AFTER local state changes
	useEffect(() => {
		onFilterChange(activeFilters);
	}, [activeFilters, onFilterChange]);

	const toggleFilter = (label: string) => {
		const lower = label.toLowerCase();
		setActiveFilters((prev) =>
			prev.includes(lower) ? prev.filter((f) => f !== lower) : [...prev, lower]
		);
	};

	const handleClearFiltersClick = () => {
		setActiveFilters([]);
		handleClearFilters();
	};

	return (
		<div className="px-3">
			<div className="mb-11 grid w-full grid-cols-2 grid-rows-2 pt-50 text-black md:justify-between lg:flex lg:flex-row">
				{FilterLists.map((list, idx) => (
					<div key={idx}>
						<Text className="font-light text-white-700" size="s">
							{list.title}
						</Text>
						<div
							className={`grid ${
								list.column === 1 ? "grid-cols-1" : "grid-cols-2 gap-x-10"
							}`}
						>
							{list.items.map((item, idx) => {
								const isActive = activeFilters.includes(
									item.label.toLowerCase()
								);
								return (
									<div
										className="font-forum text-[14px] sm:text-[20px] lg:text-2xl 2xl:text-3xl"
										key={idx}
									>
										<button
											className="relative mr-5 cursor-pointer pb-1 transition-colors duration-300 hover:text-gray-700"
											onClick={() => toggleFilter(item.label)}
										>
											<span>{item.label}</span>
											{/* underline animation */}
											<span
												className={`absolute bottom-0 left-0 h-[2px] w-full origin-left transform bg-orange-500 transition-transform duration-300 ${
													isActive ? "scale-x-100" : "scale-x-0"
												}`}
											/>
										</button>
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>

			{activeFilters.length > 0 && (
				<button
					className="cursor-pointer rounded-full border-0 bg-[#BC0E0E] px-4 py-2 font-semibold text-white-500 outline-0 ring-0 transition-colors duration-300 hover:bg-red-500 hover:text-white-100"
					onClick={handleClearFiltersClick}
				>
					Clear
				</button>
			)}
		</div>
	);
};

export default FilterList;
