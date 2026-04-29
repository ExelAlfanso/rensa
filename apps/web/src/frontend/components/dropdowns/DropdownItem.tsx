import Link from "next/link";
import React from "react";
import { cn } from "@/utils/cn";

interface DropdownItemProps {
	children: React.ReactNode;
	className?: string;
	href?: string;
	onClick?: () => void;
}
const DropdownItem = React.forwardRef<HTMLLIElement, DropdownItemProps>(
	({ href, children, className, onClick }, ref) => (
		<li className={"w-full"} ref={ref}>
			<Link
				className={cn(
					"flex px-3 py-2 hover:bg-gray-200 active:bg-white-600",
					className
				)}
				href={href || "#"}
				onClick={onClick}
			>
				{children}
			</Link>
		</li>
	)
);
DropdownItem.displayName = "DropdownItem";
export default DropdownItem;
