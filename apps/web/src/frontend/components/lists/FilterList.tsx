import type React from "react";
import FilterListContainer from "@/frontend/features/common/containers/FilterListContainer";

interface FilterListProps {
	filters: string[];
	handleClearFilters: () => void;
	onFilterChange: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterList: React.FC<FilterListProps> = ({ ...props }) => (
	<FilterListContainer {...props} />
);

export default FilterList;
