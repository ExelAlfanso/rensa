"use client";

import { useState } from "react";
import ExplorePageView from "../components/ExplorePageView";

const ExplorePageContainer: React.FC = () => {
	const [activeTabId, setActiveTabId] = useState("tab1");
	const [activeFilters, setActiveFilters] = useState<string[]>([]);

	const handleToggleFilter = (label: string) => {
		const normalizedLabel = label.toLowerCase();
		setActiveFilters((previousFilters) =>
			previousFilters.includes(normalizedLabel)
				? previousFilters.filter((filter) => filter !== normalizedLabel)
				: [...previousFilters, normalizedLabel]
		);
	};

	return (
		<ExplorePageView
			controlsModel={{
				activeFilters,
				activeTabId,
				onClearFilters: () => setActiveFilters([]),
				onTabChange: setActiveTabId,
				onToggleFilter: handleToggleFilter,
			}}
		/>
	);
};

export default ExplorePageContainer;
