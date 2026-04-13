"use client";
import { useState } from "react";
import FilterList from "@/frontend/components/lists/FilterList";
import ExploreTabs from "@/frontend/components/tabs/ExploreTabs";
import MasonryGallerySection from "./MasonryGallerySection/MasonryGallerySection";

const FilterSection = () => {
	const [activeTab, setActiveTab] = useState("tab1");
	const [filters, setFilters] = useState<string[]>([]);
	const handleClearFilters = () => {
		setFilters([]);
	};
	return (
		<div className="flex w-full flex-col justify-center px-6.25 md:px-7.5 lg:px-17.5 xl:px-22.5 2xl:px-65">
			<FilterList
				filters={filters}
				handleClearFilters={handleClearFilters}
				onFilterChange={setFilters}
			/>
			<div className="my-11 border-white-700 border-t" />
			<ExploreTabs className="mb-10" setActiveTab={setActiveTab} />
			<div className="flex items-start">
				<MasonryGallerySection
					activeTab={activeTab}
					filters={filters}
					type={"explore"}
					useDatabase={true}
				/>
			</div>
		</div>
	);
};

export default FilterSection;
