"use client";

import React from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import IconInputField from "./IconInputField";
interface SearchInputFieldProps {
  className?: string;
}

const SearchInputField: React.FC<SearchInputFieldProps> = ({ className }) => {
  return (
    <IconInputField
      type="text"
      placeholder="Search"
      Icon={MagnifyingGlassIcon}
      iconPosition="right"
      className={className}
      onChange={(e) => console.log(e.target.value)}
    />
  );
};

export default SearchInputField;
