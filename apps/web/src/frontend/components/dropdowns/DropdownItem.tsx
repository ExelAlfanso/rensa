import Link from "next/link";
import React from "react";

interface DropdownItemProps {
	children: React.ReactNode;
	className?: string;
	href?: string;
	onClick?: () => void;
}
const DropdownItem = React.forwardRef<HTMLLIElement, DropdownItemProps>(
	({ href, children, className, onClick }, ref) => {
		return (
			<li className={"w-full"} ref={ref}>
				<Link
					className={`${className} flex px-3 py-2 hover:bg-gray-200 active:bg-white-600`}
					href={href || "#"}
					onClick={onClick}
				>
					{children}
				</Link>
			</li>
		);
	}
);
DropdownItem.displayName = "DropdownItem";
export default DropdownItem;
