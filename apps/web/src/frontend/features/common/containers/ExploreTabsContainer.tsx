"use client";

import { useState } from "react";
import ExploreTabsView from "../components/ExploreTabsView";

export interface ExploreTabsContainerProps {
	className?: string;
	setActiveTab?: (tab: string) => void;
}

const ExploreTabsContainer: React.FC<ExploreTabsContainerProps> = ({
	className,
	setActiveTab,
}) => {
	const [activeTabId, setActiveTabId] = useState("tab1");

	const handleTabChange = (tabId: string) => {
		setActiveTabId(tabId);
		setActiveTab?.(tabId);
	};

	return (
		<ExploreTabsView
			activeTabId={activeTabId}
			className={className}
			onTabChange={handleTabChange}
		/>
	);
};

export default ExploreTabsContainer;
