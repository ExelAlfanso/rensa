import { use } from "react";
import ProfilePageClient from "./ProfilePageClient";
import { notFound } from "next/navigation";
import { fetchProfile } from "@/services/ProfileServices";

export default function ProfilePageWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const profileData = use(fetchProfile(id));

  if (!profileData) {
    notFound();
  }

  return <ProfilePageClient profileData={profileData} />;
}
