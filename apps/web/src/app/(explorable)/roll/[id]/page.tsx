import { redirect } from "next/navigation";
import { fetchProfileByRollId } from "@/frontend/services/profile.service";
import { fetchRollById } from "@/frontend/services/roll.service";
import RollPageClient from "./RollPageClient";

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
