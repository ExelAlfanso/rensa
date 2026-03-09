"use client";

import { useState } from "react";
import Image from "next/image";
import Heading from "@/frontend/components/Heading";
import AccentButton from "@/frontend/components/buttons/AccentButton";
import ProfileRollFilterDropdown from "@/frontend/components/dropdowns/profile/ProfileRollFilterDropdown";
import RollList, { Roll } from "@/frontend/components/lists/RollList";
import { EditRollProvider } from "@/frontend/providers/EditRollProvider";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import { CreateRollProvider } from "@/frontend/providers/CreateRollProvider";
import ShareButton from "@/frontend/components/buttons/ShareButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRollsByUserId } from "@/services/RollServices";

interface ProfilePageClientProps {
  profileData: {
    user: { id: string; username: string; avatar?: string };
    rolls: Roll[];
  };
}

export default function ProfilePageClient({
  profileData,
}: ProfilePageClientProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("latest");
  const isOwner = user?.name === profileData.user?.username;

  const { data: rolls } = useQuery({
    queryKey: ["profileRolls", profileData.user.id, filter],
    queryFn: async () => {
      const res = await fetchRollsByUserId(profileData.user.id, filter);
      return res;
    },
    enabled: !!profileData.user?.username,
  });

  const handleRollUpdate = (roll: { rollId: string; name: string }) => {
    queryClient.setQueryData<Roll[]>(
      ["profileRolls", profileData.user.id, filter],
      (oldRolls) => {
        if (!oldRolls) return [];
        return oldRolls.map((r) =>
          r._id === roll.rollId ? { ...r, name: roll.name } : r,
        );
      },
    );
  };
  const handleRollDelete = (rollId: string) => {
    queryClient.setQueryData<Roll[]>(
      ["profileRolls", profileData.user.id, filter],
      (oldRolls) => {
        if (!oldRolls) return [];
        return oldRolls.filter((r) => r._id !== rollId);
      },
    );
  };

  const handleRollCreate = (roll: { _id: string; name: string }) => {
    queryClient.setQueryData<Roll[]>(
      ["profileRolls", profileData.user.id, filter],
      (oldRolls) => {
        if (!oldRolls) return [];
        return [
          {
            _id: roll._id,
            userId: user?.id || "",
            name: roll.name,
            previewPhotos: [],
            createdAt: new Date().toISOString(),
          },
          ...oldRolls,
        ];
      },
    );
  };
  return (
    <CreateRollProvider onRollCreate={handleRollCreate}>
      <EditRollProvider
        onRollDelete={handleRollDelete}
        onRollUpdate={handleRollUpdate}
      >
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white">
          <div className="w-[131px] h-[131px] relative rounded-full overflow-hidden">
            <Image
              src={profileData.user?.avatar || "/profile.jpg"}
              alt={profileData.user?.username || "User Avatar"}
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <Heading size="l" className="mt-4 text-black">
            @{profileData.user?.username || "User Name"}
          </Heading>
          <div className="flex flex-row items-center justify-center gap-4 mt-4">
            <ShareButton userId={user?.id || ""}></ShareButton>

            {isOwner && <AccentButton>Edit Profile</AccentButton>}
          </div>
          <div className="flex flex-col items-start justify-center w-full gap-6 mt-10 xl:mt-0 px-30">
            <ProfileRollFilterDropdown setFilter={setFilter} />
            <RollList rolls={rolls} isOwner={isOwner} />
          </div>
        </div>
      </EditRollProvider>
    </CreateRollProvider>
  );
}
