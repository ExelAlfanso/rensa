"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Footer from "@/frontend/components/footer/Footer";
import Text from "@/frontend/components/Text";

export default function VerifiedClient() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/login");
		}, 3000);

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="w-full bg-white">
			<div className="relative flex min-h-screen flex-col justify-between rounded-b-3xl text-black">
				<Image
					alt="Not found"
					className="absolute inset-0 mx-auto h-auto w-full self-end object-contain xl:w-[75%]"
					height={0}
					sizes="100vw"
					src="/images/not-found/not-found.png"
					width={0}
				/>
				<Image
					alt="Not found"
					className="absolute top-20 right-20 xl:size-auto"
					height={0}
					sizes="100vw"
					src="/images/not-found/pic.png"
					width={0}
				/>
				<Image
					alt="Not found"
					className="absolute bottom-0 size-auto"
					height={0}
					sizes="100vw"
					src="/images/not-found/pic2.png"
					width={0}
				/>

				<div className="absolute -top-15 flex min-h-screen w-full flex-col items-center justify-center md:-top-30">
					<Image
						alt="Verified"
						className="w-50"
						height={0}
						src="/verified.svg"
						width={0}
					/>
					<h1 className="font-forum text-[28px] md:text-[38px]">
						Your email has been verified
					</h1>
					<h2 className="mb-5 font-forum text-[20px] md:mb-10 md:text-[26px]">
						Log in to start enjoying Rensa.
					</h2>
					<div className="flex items-center gap-4">
						<Text className="" size="m">
							Redirecting to the login page...
						</Text>
						<div className="loading loading-spinner" />
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
