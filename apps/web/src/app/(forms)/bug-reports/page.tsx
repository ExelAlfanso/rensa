"use client";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import BugReportForm from "@/frontend/components/forms/BugReportForm";

export default function BugReportPage() {
	const router = useRouter();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center overflow-y-auto bg-white-500 py-10 text-primary">
			<div className="mb-8 flex w-full items-start px-5 md:px-10 xl:px-65">
				<button
					className="cursor-pointer text-primary transition-colors duration-300 hover:text-gray-500"
					onClick={() => router.back()}
					type="button"
				>
					<ArrowLeftIcon size={32} />
				</button>
			</div>
			<BugReportForm />
		</div>
	);
}
