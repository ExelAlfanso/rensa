"use client";

import React from "react";

interface DropdownProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  Tag?: React.ElementType | string;
}
const Dropdown: React.FC<DropdownProps> = ({ children, Tag = undefined }) => {
  return (
    <div>
      {Tag && <Tag popoverTarget="popover-1" />}
      <ul
        popover="auto"
        id="popover-1"
        style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}
        className="menu dropdown dropdown-center bg-white-200 rounded-3xl z-1 w-66 p-0 shadow-sm inline-flex items-center justify-center"
      >
        {children}
      </ul>
    </div>
  );
};

export default Dropdown;
