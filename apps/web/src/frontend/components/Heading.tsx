import type React from "react";

interface HeadingProps {
	alignment?: "left" | "center" | "right";
	children?: React.ReactNode;
	className?: string;
	id?: string;
	size?: "s" | "m" | "l" | "xl" | "xxl" | "custom1";
}

const Heading: React.FC<HeadingProps> = ({
	id,
	className,
	children,
	alignment = "left",
	size = "xl",
}) => {
	const sizeClasses = {
		s: "text-[24px]",
		m: "text-[30px]",
		l: "text-[38px]",
		xl: "text-[47px]",
		xxl: "text-[59px]",
		custom1: "text-[96px]",
	};
	const alignmentClasses = {
		left: "text-left",
		center: "text-center",
		right: "text-right",
	};
	return (
		<div
			className={`font-forum ${className} ${sizeClasses[size]} ${alignmentClasses[alignment]}`}
			id={id}
		>
			{children}
		</div>
	);
};

export default Heading;
