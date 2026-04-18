"use client";

import type React from "react";
import { tabDatas } from "@/frontend/data/exploreDatas";
import { cn } from "@/utils/cn";
import "@/frontend/components/tabs/ExploreTabs.css";

interface ExploreTabsControlViewProps {
	activeTabId: string;
	className?: string;
	onTabChange: (tabId: string) => void;
}

const ExploreTabsControlView: React.FC<ExploreTabsControlViewProps> = ({
	activeTabId,
	className,
	onTabChange,
}) => {
	return (
		<div className={cn("tabs tabs-border gap-5", className)} role="tablist">
			{tabDatas.map((tab) => (
				<input
					aria-label={tab.label}
					checked={activeTabId === tab.id}
					className="tab text-[14px] text-primary transition-all duration-300 hover:text-black-300 md:text-[20px]"
					key={tab.id}
					name="explore_tabs"
					onChange={() => onTabChange(tab.id)}
					type="radio"
				/>
			))}
		</div>
	);
};

export default ExploreTabsControlView;
