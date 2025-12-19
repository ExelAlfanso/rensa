"use client";

import React from "react";
import TertiaryDropdown from "../TertiaryDropdown";

interface ProfileRollFilterDropdownProps {
  setFilter?: (filter: string) => void;
}

const ProfileRollFilterDropdown: React.FC<ProfileRollFilterDropdownProps> = ({
  setFilter,
}) => {
  const filters = ["Latest", "Oldest"];
  return (
    <TertiaryDropdown
      className="w-35"
      initialValue={"Latest"}
      values={filters}
      onChange={(value) => setFilter?.(value.toLowerCase().replace(" ", "-"))}
    />
  );
};

export default ProfileRollFilterDropdown;
