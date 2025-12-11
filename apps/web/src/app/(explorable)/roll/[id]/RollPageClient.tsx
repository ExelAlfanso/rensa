"use client";
import RollPageDropdown from "@/components/dropdowns/rolls/RollPageDropdown";
import Heading from "@/components/Heading";
import { EditRollProvider } from "@/providers/EditRollProvider";
import RollPageMasonryGallerySection from "@/sections/RollPageMasonryGallerySection/RollPageMasonryGallerySection";
import { useAuthStore } from "@/stores/useAuthStore";

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
  return (
    <EditRollProvider>
      <div className="min-h-screen w-full bg-white">
        <span className="flex flex-row items-center justify-center mt-30 space-x-2">
          <Heading className="text-black">{name}</Heading>
          <RollPageDropdown
            isOwner={isOwner}
            rollId={id}
            name={name}
          ></RollPageDropdown>
        </span>
        <RollPageMasonryGallerySection isOwner={isOwner} rollId={id} />
      </div>
    </EditRollProvider>
  );
}
