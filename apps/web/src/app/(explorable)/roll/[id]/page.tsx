import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchProfileByRollId } from "@/frontend/services/profile.service";
import { fetchRollById } from "@/frontend/services/roll.service";
import RollPageClient from "./RollPageClient";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	try {
		const rollData = await fetchRollById(id);
		const rollName = rollData?.name || "Roll";
		const description =
			rollData?.description || `Explore the ${rollName} photo roll on Rensa.`;

		return {
			title: `${rollName} Roll`,
			description,
			alternates: {
				canonical: `/roll/${id}`,
			},
			openGraph: {
				title: `${rollName} Roll`,
				description,
				url: `/roll/${id}`,
				type: "website",
			},
			twitter: {
				card: "summary_large_image",
				title: `${rollName} Roll`,
				description,
			},
		};
	} catch {
		return {
			title: "Roll Not Found",
			robots: {
				index: false,
				follow: false,
			},
		};
	}
}

export default async function RollPageWrapper({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	let rollData: Awaited<ReturnType<typeof fetchRollById>> | null = null;
	let ownerId: Awaited<ReturnType<typeof fetchProfileByRollId>> | null = null;
	try {
		[rollData, ownerId] = await Promise.all([
			fetchRollById(id),
			fetchProfileByRollId(id),
		]);
	} catch {
		redirect("/404");
	}

	if (!(rollData && ownerId)) {
		redirect("/404");
	}

	return (
		<RollPageClient
			id={id}
			name={rollData.name || "Unknown Roll"}
			ownerId={ownerId}
		/>
	);
}
