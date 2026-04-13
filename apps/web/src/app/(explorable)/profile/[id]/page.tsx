import { notFound } from "next/navigation";
import { use } from "react";
import { fetchProfile } from "@/frontend/services/profile.service";
import { fetchRollsByUserId } from "@/frontend/services/roll.service";
import ProfilePageClient from "./ProfilePageClient";

export default function ProfilePageWrapper({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const profileData = use(fetchProfile(id));
	const rollData = use(fetchRollsByUserId(id));
	if (!profileData) {
		notFound();
	}

	return (
		<ProfilePageClient
			profileData={{
				user: { id, ...profileData },
				rolls: rollData.data,
			}}
		/>
	);
}
