import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProfile } from "@/frontend/services/profile.service";
import { fetchRollsByUserId } from "@/frontend/services/roll.service";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	try {
		const profileData = await fetchProfile(id);
		const username = profileData?.username || "Photographer";
		const title = `${username}'s Profile`;
		const description = `Explore ${username}'s photography rolls and visual recipes on Rensa.`;

		return {
			title,
			description,
			alternates: {
				canonical: `/profile/${id}`,
			},
			openGraph: {
				title,
				description,
				url: `/profile/${id}`,
				type: "profile",
			},
			twitter: {
				card: "summary_large_image",
				title,
				description,
			},
		};
	} catch {
		return {
			title: "Profile Not Found",
			robots: {
				index: false,
				follow: false,
			},
		};
	}
}

export default async function ProfilePageWrapper({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	let profileData: Awaited<ReturnType<typeof fetchProfile>> | null = null;
	let rollData: Awaited<ReturnType<typeof fetchRollsByUserId>> | null = null;

	try {
		[profileData, rollData] = await Promise.all([
			fetchProfile(id),
			fetchRollsByUserId(id),
		]);
	} catch {
		profileData = null;
		rollData = null;
	}

	if (!profileData) {
		notFound();
	}

	return (
		<ProfilePageClient
			profileData={{
				user: { id, ...profileData },
				rolls: rollData ?? [],
			}}
		/>
	);
}
