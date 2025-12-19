import { use } from "react";
import ProfilePageClient from "./ProfilePageClient";
import { notFound } from "next/navigation";
import { fetchProfile } from "@/services/ProfileServices";
import { fetchRollsByUserId } from "@/services/RollServices";

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
