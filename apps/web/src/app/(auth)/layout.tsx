"use client";
import type { ReactNode } from "react";
import ForestSection from "@/frontend/sections/ForestSection";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<section className="flex min-h-screen w-full md:flex-row">
			<div className="hidden w-0 md:block md:w-1/4">
				<ForestSection />
			</div>
			<div className="flex w-full items-center justify-center bg-white md:w-3/4">
				{children}
			</div>
		</section>
	);
}
