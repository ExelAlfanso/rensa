"use client";
import FilterList from "@/frontend/components/lists/FilterList";
import ExploreTabs from "@/frontend/components/tabs/ExploreTabs";
import { useState } from "react";
import MasonryGallerySection from "./MasonryGallerySection/MasonryGallerySection";

const FilterSection = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [filters, setFilters] = useState<string[]>([]);
  const handleClearFilters = () => {
    setFilters([]);
  };
  return (
    <div className="flex flex-col justify-center w-full px-[25px] md:px-[30px] lg:px-[70px] xl:px-[90px] 2xl:px-[260px]">
      <FilterList
        filters={filters}
        onFilterChange={setFilters}
        handleClearFilters={handleClearFilters}
      ></FilterList>
      <div className="border-t border-white-700 my-11"></div>
      <ExploreTabs setActiveTab={setActiveTab} className="mb-10"></ExploreTabs>
      <div className="flex items-start">
        <MasonryGallerySection
          activeTab={activeTab}
          filters={filters}
          useDatabase={true}
          type={"explore"}
        ></MasonryGallerySection>
      </div>
    </div>
  );
};

export default FilterSection;
