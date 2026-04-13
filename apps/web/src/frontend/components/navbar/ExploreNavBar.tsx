"use client";
import Link from "next/link";
import ProfileButton from "@/frontend/components/buttons/ProfileIconButton";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import BookmarkButton from "../buttons/BookmarkButton";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import TertiaryButton from "../buttons/TertiaryButton";
import AccountDropdown from "../dropdowns/AccountDropdown";
import NotificationDropdown from "../dropdowns/notification/NotificationDropdown";
import Heading from "../Heading";
import Logo from "../icons/Logo";

const ExploreNavbar = () => {
	const user = useAuthStore((state) => state.user);
	return (
		<nav className="fixed top-5 left-1/2 z-20 flex h-14 w-[90%] -translate-x-1/2 items-center justify-between rounded-[48px] bg-white-200 text-black shadow-lg md:h-18 lg:w-[70%]">
			<div className="ml-2 flex flex-row items-center gap-1 lg:ml-6 lg:gap-4">
				<Logo size={"s"} />
				<Link className="hidden lg:block" href="/explore">
					<Heading size="s">Rensa</Heading>
				</Link>
			</div>
			<div className="mr-6 flex flex-row items-center justify-center gap-6">
				<span className="inline-flex items-center gap-2">
					{user ? (
						<>
							<SecondaryButton href="/upload">Create</SecondaryButton>
							<span className="flex">
								<NotificationDropdown />
								<BookmarkButton />
							</span>
							<ProfileButton alt={""} src={"/profile.jpg"} />
							<AccountDropdown src="/profile.jpg" user={user} />
						</>
					) : (
						<>
							<PrimaryButton href="/login">Login</PrimaryButton>
							<TertiaryButton href="/register">Sign Up</TertiaryButton>
						</>
					)}
				</span>
			</div>
		</nav>
	);
};

export default ExploreNavbar;
