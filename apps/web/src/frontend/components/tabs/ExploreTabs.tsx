"use client";

import type React from "react";
import { tabDatas } from "@/frontend/data/exploreDatas";
import "./ExploreTabs.css";
interface ExploreTabsProps {
	className?: string;
	setActiveTab?: (tab: string) => void;
}

const ExploreTabs: React.FC<ExploreTabsProps> = ({
	className,
	setActiveTab,
}) => {
	return (
		<div className={`tabs tabs-border gap-5 ${className}`}>
			{tabDatas.map((tab, idx) => (
				<input
					aria-label={tab.label}
					className={
						"tab text-[14px] text-primary transition-all duration-300 hover:text-black-300 md:text-[20px]"
					}
					defaultChecked={tab.id === "tab1"}
					key={idx}
					name="my_tabs_2"
					onClick={() => {
						setActiveTab?.(tab.id);
						tab.isActive = !tab.isActive;
					}}
					type="radio"
				/>
			))}
		</div>
	);
};

export default ExploreTabs;
