import Button from "@/frontend/components/buttons/Button";
import TertiaryButton from "@/frontend/components/buttons/TertiaryButton";
import { removeUserPhoto } from "@/services/PhotoPostServices";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

interface PhotoState {
  photoId: string;
  isOwner: boolean;
}
interface EditPhotoContextType {
  isOpen: boolean;
  openEditor: (photo: PhotoState) => void;
  closeEditor: () => void;
}
const EditPhotoContext = createContext<EditPhotoContextType | undefined>(
  undefined,
);

export const useEditPhoto = () => {
  const ctx = useContext(EditPhotoContext);
  if (!ctx)
    throw new Error("useEditPhoto must be used within EditPhotoProvider");
  return ctx;
};

interface EditPhotoProviderProps {
  children: React.ReactNode;
}
export const EditPhotoProvider: React.FC<EditPhotoProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [photoState, setPhotoState] = useState<PhotoState>({
    photoId: "",
    isOwner: false,
  });
  const openEditor = (photo: PhotoState) => {
    setIsOpen(true);
    setPhotoState(photo);
  };
  const closeEditor = () => {
    setIsOpen(false);
  };
  const removePhoto = async (photoId: string) => {
    try {
      await removeUserPhoto(photoId);
    } catch (err) {
      console.error("Error deleting photo:", err);
    } finally {
      closeEditor();
      router.replace("/explore");
    }
  };
  return (
    <EditPhotoContext.Provider value={{ isOpen, openEditor, closeEditor }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-black">
          <div className="bg-white rounded-2xl p-6 w-[380px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to delete this photo?
            </h2>
            <div className="flex flex-row gap-4 justify-end">
              <Button
                onClick={() => removePhoto(photoState.photoId)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
              <TertiaryButton onClick={closeEditor}>Cancel</TertiaryButton>
            </div>
          </div>
        </div>
      )}
    </EditPhotoContext.Provider>
  );
};
