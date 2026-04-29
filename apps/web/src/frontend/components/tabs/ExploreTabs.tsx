"use client";

import type React from "react";
import ExploreTabsContainer, {
	type ExploreTabsContainerProps,
} from "@/frontend/features/common/containers/ExploreTabsContainer";

type ExploreTabsProps = ExploreTabsContainerProps;

const ExploreTabs: React.FC<ExploreTabsProps> = ({
	className,
	setActiveTab,
}) => (
	<ExploreTabsContainer className={className} setActiveTab={setActiveTab} />
);

export default ExploreTabs;
