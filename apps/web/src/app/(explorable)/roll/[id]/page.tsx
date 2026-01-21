import RollPageClient from "./RollPageClient";
import { fetchProfileByRollId } from "@/services/ProfileServices";
import { fetchRollById } from "@/services/RollServices";
import { redirect } from "next/navigation";

export default async function RollPageWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let rollData;
  let ownerId;
  try {
    rollData = await fetchRollById(id);
    ownerId = await fetchProfileByRollId(id);
  } catch {
    redirect("/404");
  }

  if (!rollData || !ownerId) {
    redirect("/404");
  }

  return (
    <RollPageClient
      ownerId={ownerId}
      name={rollData.name || "Unknown Roll"}
      id={id}
    ></RollPageClient>
  );
}
