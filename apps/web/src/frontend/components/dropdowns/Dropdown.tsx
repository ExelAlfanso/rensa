"use client";

import type React from "react";

interface DropdownProps {
	children?: React.ReactNode;
	className?: string;
	id?: string;
	Tag?: React.ElementType | string;
}
const Dropdown: React.FC<DropdownProps> = ({ children, Tag }) => (
	<div>
		{Tag && <Tag popoverTarget="popover-1" />}
		<ul
			className="menu dropdown dropdown-center z-1 inline-flex w-66 items-center justify-center rounded-3xl bg-white-200 p-0 shadow-sm"
			id="popover-1"
			popover="auto"
			style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}
		>
			{children}
		</ul>
	</div>
);

export default Dropdown;
