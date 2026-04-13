import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "@/frontend/hooks/use-outside-click";
import { useToast } from "@/frontend/providers/ToastProvider";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import { useRollsStore } from "@/frontend/stores/useRollsStore";
import RollDropdownView from "../components/RollDropdownView";

export interface RollDropdownContainerProps {
	closeAll: () => void;
	disabled: boolean;
	isOpen: boolean;
	savedToRolls: string[];
	selectedRoll: { id: string; name: string } | null;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedRoll: React.Dispatch<
		React.SetStateAction<{ id: string; name: string } | null>
	>;
}

const RollDropdownContainer: React.FC<RollDropdownContainerProps> = ({
	isOpen,
	setIsOpen,
	closeAll,
	savedToRolls,
	selectedRoll,
	setSelectedRoll,
	disabled,
}) => {
	const router = useRouter();
	const { user } = useAuthStore();
	const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
	const [isCreating, setIsCreating] = useState(false);
	const [newRollName, setNewRollName] = useState("");
	const { rolls, fetchRolls, isLoading, createRoll } = useRollsStore();
	const { showToast } = useToast();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const dropdownRef = useOutsideClick<HTMLDivElement>((event: MouseEvent) => {
		setIsCreating(false);
		setNewRollName("");
		if (buttonRef.current?.contains(event.target as Node)) {
			return;
		}
		closeAll();
	});
	const listRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		if (isCreating && listRef.current) {
			const list = listRef.current;
			list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
		}
	}, [isCreating]);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!user?.id) {
			router.push("/login");
			return;
		}
		e.stopPropagation();
		e.preventDefault();
		setIsOpen((prev) => !prev);
	};

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		fetchRolls().catch(() => undefined);
		const button = buttonRef.current;
		const dropdown = dropdownRef.current;

		if (!(button && dropdown)) {
			return;
		}

		const buttonRect = button.getBoundingClientRect();
		const dropdownRect = dropdown.getBoundingClientRect();
		setDropdownPosition({
			top: buttonRect.bottom + window.scrollY + 4,
			left:
				buttonRect.left +
				window.scrollX +
				buttonRect.width / 2 -
				dropdownRect.width / 2,
		});
	}, [isOpen, fetchRolls, dropdownRef]);

	useEffect(() => {
		const handleResize = () => {
			setIsOpen(false);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [setIsOpen]);

	useEffect(() => {
		const handleScroll = () => {
			if (!dropdownRef.current) {
				return;
			}

			const rect = dropdownRef.current.getBoundingClientRect();
			const completelyOutOfView =
				rect.bottom < 0 || rect.top > window.innerHeight;

			if (completelyOutOfView) {
				setIsOpen(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [dropdownRef, setIsOpen]);

	const handleCreate = () => {
		setIsCreating(true);
		setNewRollName("");
	};

	const handleCreateRoll = async () => {
		if (!newRollName.trim()) {
			return;
		}
		try {
			await createRoll({ name: newRollName });
			showToast("Roll created successfully", "success");
		} catch (error) {
			showToast("Failed to create roll", "error");
			console.error("Failed to create roll:", error);
		} finally {
			setIsCreating(false);
			setNewRollName("");
		}
	};

	return (
		<RollDropdownView
			buttonRef={buttonRef}
			disabled={disabled}
			dropdownPosition={dropdownPosition}
			dropdownRef={dropdownRef}
			handleClick={handleClick}
			handleCreate={handleCreate}
			handleCreateRoll={handleCreateRoll}
			isCreating={isCreating}
			isLoading={isLoading}
			isOpen={isOpen}
			listRef={listRef}
			newRollName={newRollName}
			rolls={rolls}
			savedToRolls={savedToRolls}
			selectedRoll={selectedRoll}
			setIsCreating={setIsCreating}
			setNewRollName={setNewRollName}
			setSelectedRoll={setSelectedRoll}
		/>
	);
};

export default RollDropdownContainer;
