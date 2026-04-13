"use client";
import Link from "next/link";
import LinkPrimaryButton from "../buttons/LinkButtons/LinkPrimaryButton";
import LinkTertiaryButton from "../buttons/LinkButtons/LinkTertiaryButton";
import Logo from "../icons/Logo";

const HomeNavbar = () => {
	return (
		<nav className="fixed top-5 left-1/2 z-30 flex h-14 w-[90%] -translate-x-1/2 items-center justify-between rounded-[48px] bg-white-200 text-black shadow-lg md:h-18 lg:w-[70%] xl:w-[80%]">
			<div className="ml-2 flex flex-row items-center gap-1 lg:ml-6 lg:gap-4">
				<Logo size={"s"} />
				<Link href="/home">
					<h1 className="hidden font-forum text-[24px] lg:flex">Rensa</h1>
				</Link>
			</div>
			<div className="mr-6 flex flex-row items-center justify-center gap-6">
				<span className="inline-flex items-center gap-2">
					<LinkTertiaryButton href={"/explore"}>Discover</LinkTertiaryButton>
					<LinkPrimaryButton href={"/register"}>Get Started</LinkPrimaryButton>
					<span className="hidden lg:flex" />
				</span>
			</div>
		</nav>
	);
};

export default HomeNavbar;
