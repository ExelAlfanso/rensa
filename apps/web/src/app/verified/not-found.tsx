"use client";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import IconButton from "@/frontend/components/buttons/IconButton";
import Footer from "@/frontend/components/footer/Footer";
import Text from "@/frontend/components/Text";
export default function NotFound() {
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

				<div className="absolute top-10 flex w-full flex-1 flex-col items-center justify-center gap-8 px-6 py-12 md:flex-row md:text-left">
					<h1 className="font-bold font-sans text-[120px] leading-none md:text-[240px]">
						401
					</h1>
					<div className="flex w-60 flex-col items-center space-y-4 text-center xl:w-85 xl:items-start xl:text-left">
						<h1 className="font-forum text-[28px] md:text-[38px]">
							you&apos;ve reached an empty zone
						</h1>
						<Text size="m">You are not authorized to view this page.</Text>
						<Link href={"/"}>
							<IconButton
								className="h-12"
								color="primary"
								Icon={ArrowRightIcon}
								iconPosition={"right"}
								weight={"bold"}
							>
								<p className="font-figtree font-normal text-[12px]">
									Return to Homepage
								</p>
							</IconButton>
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
