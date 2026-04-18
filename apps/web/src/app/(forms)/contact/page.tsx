"use client";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import ContactForm from "@/frontend/components/forms/ContactForm";

export default function ContactPage() {
	const router = useRouter();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white-500 py-10 text-primary">
			<div className="mb-8 flex w-full items-start px-5 md:px-10 xl:px-65">
				<button
					className="cursor-pointer text-primary transition-colors duration-300 hover:text-gray-500"
					onClick={() => router.back()}
					type="button"
				>
					<ArrowLeftIcon size={32} />
				</button>
			</div>
			<ContactForm />
		</div>
	);
}
