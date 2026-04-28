import { useState } from "react";
import FilterListView from "../components/FilterListView";

export interface FilterListContainerProps {
	filters: string[];
	handleClearFilters: () => void;
	onFilterChange: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterListContainer: React.FC<FilterListContainerProps> = ({
	onFilterChange,
	filters,
	handleClearFilters,
}) => {
	const [activeFilters, setActiveFilters] = useState<string[]>(filters);

	const handleToggleFilter = (label: string) => {
		const normalizedLabel = label.toLowerCase();
		setActiveFilters((previousFilters) => {
			const nextFilters = previousFilters.includes(normalizedLabel)
				? previousFilters.filter((filter) => filter !== normalizedLabel)
				: [...previousFilters, normalizedLabel];
			onFilterChange(nextFilters);
			return nextFilters;
		});
	};

	const handleClearFiltersClick = () => {
		setActiveFilters([]);
		onFilterChange([]);
		handleClearFilters();
	};

	return (
		<FilterListView
			activeFilters={activeFilters}
			onClear={handleClearFiltersClick}
			onToggleFilter={handleToggleFilter}
		/>
	);
};

export default FilterListContainer;
