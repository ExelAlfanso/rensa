"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOutsideClick } from "@/frontend/hooks/use-outside-click";
import { useToast } from "@/frontend/providers/ToastProvider";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import { useRollsStore } from "@/frontend/stores/useRollsStore";
import RollDropdownIconButtonView from "../components/RollDropdownIconButtonView";

export interface RollDropdownIconButtonContainerProps {
	closeAll?: () => void;
	disabled: boolean;
	isOpen: boolean;
	savedToRolls: string[];
	selectedRoll: { id: string; name: string } | null;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedRoll: React.Dispatch<
		React.SetStateAction<{ id: string; name: string } | null>
	>;
}

const RollDropdownIconButtonContainer: React.FC<
	RollDropdownIconButtonContainerProps
> = ({
	isOpen,
	setIsOpen,
	closeAll,
	savedToRolls,
	selectedRoll,
	setSelectedRoll,
	disabled,
}) => {
	const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
	const [isCreating, setIsCreating] = useState(false);
	const router = useRouter();
	const [newRollName, setNewRollName] = useState("");
	const { rolls, fetchRolls, isLoading, createRoll } = useRollsStore();
	const { showToast } = useToast();
	const buttonRef = useRef<HTMLDivElement>(null);
	const { user } = useAuthStore();
	const dropdownRef = useOutsideClick<HTMLDivElement>((event: MouseEvent) => {
		setIsCreating(false);
		setNewRollName("");
		if (buttonRef.current?.contains(event.target as Node)) {
			return;
		}
		closeAll?.();
	});
	const listRef = useRef<HTMLUListElement>(null);
	const closeDropdown = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);

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

	const updateDropdownPosition = useCallback(() => {
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
	}, [dropdownRef]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		fetchRolls().catch(() => undefined);
		updateDropdownPosition();
	}, [fetchRolls, isOpen, updateDropdownPosition]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		window.addEventListener("resize", closeDropdown, { passive: true });
		return () => {
			window.removeEventListener("resize", closeDropdown);
		};
	}, [closeDropdown, isOpen]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleScroll = () => {
			const dropdown = dropdownRef.current;
			if (!dropdown) {
				return;
			}

			const rect = dropdown.getBoundingClientRect();
			const completelyOutOfView =
				rect.bottom < 0 || rect.top > window.innerHeight;

			if (completelyOutOfView) {
				closeDropdown();
				return;
			}

			updateDropdownPosition();
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [closeDropdown, dropdownRef, isOpen, updateDropdownPosition]);

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
		} catch {
			showToast("Failed to create roll", "error");
		} finally {
			setIsCreating(false);
			setNewRollName("");
		}
	};

	return (
		<RollDropdownIconButtonView
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

export default RollDropdownIconButtonContainer;
