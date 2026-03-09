"use client";
import RollPageDropdown from "@/frontend/components/dropdowns/rolls/RollPageDropdown";
import Heading from "@/frontend/components/Heading";
import { EditRollProvider } from "@/frontend/providers/EditRollProvider";
import RollPageMasonryGallerySection from "@/frontend/sections/RollPageMasonryGallerySection/RollPageMasonryGallerySection";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import { useState } from "react";

interface RollPageClientProps {
  id: string;
  ownerId: string;
  name: string;
}

export default function RollPageClient({
  id,
  ownerId,
  name,
}: RollPageClientProps) {
  const { user } = useAuthStore();
  const isOwner = user?.id === ownerId;
  const [rollName, setRollName] = useState(name);
  const handleOnRollUpdate = (roll: { rollId: string; name: string }) => {
    setRollName(roll.name);
  };

  return (
    <EditRollProvider onRollUpdate={handleOnRollUpdate}>
      <div className="min-h-screen w-full bg-white">
        <span className="flex flex-row items-center justify-center mt-30 space-x-2">
          <Heading className="text-black">{rollName}</Heading>
          <RollPageDropdown
            isOwner={isOwner}
            rollId={id}
            name={rollName}
            ownerId={ownerId}
          ></RollPageDropdown>
        </span>
        <RollPageMasonryGallerySection isOwner={isOwner} rollId={id} />
      </div>
    </EditRollProvider>
  );
}
