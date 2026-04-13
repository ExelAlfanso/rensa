import Image from "next/image";
import Link from "next/link";
import type React from "react";

interface LogoProps {
	className?: string;
	color?: string;
	size?: string;
}
const Logo: React.FC<LogoProps> = ({
	size = "s",
	className,
	color = "black",
}) => {
	const sizeClasses: Record<string, string> = {
		s: "w-10 h-10 md:w-12 md:h-12",
		m: "w-16 h-16",
		lg: "w-20 h-20",
		xl: "w-32 h-32",
	};

	return (
		<Link className={`relative ${sizeClasses[size]} ${className}`} href="/home">
			<Image
				alt="Logo"
				className="aspect-square object-contain"
				fill
				src={`${color === "black" ? "/logo.svg" : "/whiteLogo.svg"}`}
			/>
		</Link>
	);
};

export default Logo;
