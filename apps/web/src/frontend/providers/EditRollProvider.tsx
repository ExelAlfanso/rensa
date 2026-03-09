"use client";

import PrimaryButton from "@/frontend/components/buttons/PrimaryButton";
import TertiaryButton from "@/frontend/components/buttons/TertiaryButton";
import { createContext, useState, useContext, ReactNode } from "react";
import { useToast } from "./ToastProvider";
import { api } from "@/lib/axios-client";
import { useRouter } from "next/navigation";
import Button from "@/frontend/components/buttons/Button";

interface EditRollState {
  rollId: string;
  name: string;
  type: "deleting" | "renaming" | "default";
  callbackUrl?: string;
}

interface EditRollContextType {
  isOpen: boolean;
  roll: EditRollState | null;
  openEditor: (roll: EditRollState) => void;
  closeEditor: () => void;
  saveChanges: (rollId: string, name: string) => Promise<void>;
  removeRoll: (rollId: string, callbackUrl?: string) => Promise<void>;
}

const EditRollContext = createContext<EditRollContextType | undefined>(
  undefined,
);

export const useEditRoll = () => {
  const ctx = useContext(EditRollContext);
  if (!ctx) throw new Error("useEditRoll must be used within EditRollProvider");
  return ctx;
};

interface EditRollProviderProps {
  children: ReactNode;
  onRollUpdate?: (roll: EditRollState) => void;
  onRollDelete?: (rollId: string) => void;
}

export const EditRollProvider = ({
  children,
  onRollUpdate,
  onRollDelete,
}: EditRollProviderProps) => {
  const [type, setType] = useState<"deleting" | "renaming" | "default">(
    "default",
  );
  const [isOpen, setIsOpen] = useState(false);
  const [roll, setRoll] = useState<EditRollState | null>(null);
  const [name, setName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const openEditor = (roll: EditRollState) => {
    setType(roll.type);
    if (roll.type === "deleting") {
      setIsDeleting(true);
    } else if (roll.type === "renaming") {
      setIsDeleting(false);
    }
    setRoll(roll);
    setName(roll.name);
    setIsOpen(true);
  };

  const closeEditor = () => {
    setIsOpen(false);
    setRoll(null);
    setName("");
    setIsDeleting(false);
  };
  const removeRoll = async (rollId: string, callbackUrl?: string) => {
    try {
      await api.delete(`/rolls/${rollId}`);
      showToast("Roll deleted successfully", "success");

      if (onRollDelete) onRollDelete(rollId);

      closeEditor();

      if (callbackUrl) {
        router.push(callbackUrl);
      }
    } catch (err) {
      showToast("Failed to delete roll", "error");
      console.error("Failed to delete roll:", err);
    }
  };
  const saveChanges = async (rollId: string, name: string) => {
    try {
      await api.patch(`/rolls/${rollId}`, { name });

      if (onRollUpdate) onRollUpdate({ rollId, name, type: "default" });

      closeEditor();
      showToast("Roll updated successfully", "success");
    } catch (err) {
      showToast("Failed to update roll", "error");
      console.error("Failed to update roll:", err);
    }
  };

  return (
    <EditRollContext.Provider
      value={{ isOpen, roll, openEditor, closeEditor, saveChanges, removeRoll }}
    >
      {children}

      {isOpen && roll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-black">
          <div className="bg-white rounded-2xl p-6 w-[380px] shadow-xl">
            {!isDeleting ? (
              <>
                <h2 className="mb-4 text-xl font-semibold">Edit Roll</h2>
                <label className="text-sm font-medium">Roll Name</label>
                <input
                  className="w-full px-3 py-2 mt-1 mb-3 border rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div
                  className={`${
                    type === "default" ? "justify-between" : "justify-end"
                  } gap-2 mt-5 flex`}
                >
                  {type === "default" && (
                    <Button
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={() => setIsDeleting(true)}
                    >
                      Delete
                    </Button>
                  )}
                  <div className={`flex flex-row gap-2`}>
                    <TertiaryButton onClick={closeEditor}>
                      Cancel
                    </TertiaryButton>
                    <PrimaryButton
                      onClick={() => {
                        closeEditor();
                        saveChanges(roll.rollId, name);
                      }}
                    >
                      Save
                    </PrimaryButton>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-4 text-xl font-semibold">
                  Are you sure you want to delete this roll?
                </h2>
                <div className="flex justify-end gap-2 mt-5">
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                      closeEditor();
                      removeRoll(roll.rollId, roll.callbackUrl);
                    }}
                  >
                    Yes
                  </Button>
                  <TertiaryButton
                    onClick={() => {
                      if (type === "deleting") closeEditor();
                      else setIsDeleting(false);
                    }}
                  >
                    No
                  </TertiaryButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </EditRollContext.Provider>
  );
};
