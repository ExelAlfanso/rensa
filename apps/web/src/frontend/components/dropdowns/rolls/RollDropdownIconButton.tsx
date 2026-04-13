"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import IconButton from "@/frontend/components/buttons/IconButton";
import SearchInputField from "@/frontend/components/inputfields/SearchInputField";
import Text from "@/frontend/components/Text";
import { useOutsideClick } from "@/frontend/hooks/use-outside-click";
import { useToast } from "@/frontend/providers/ToastProvider";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import { useRollsStore } from "@/frontend/stores/useRollsStore";
import PrimaryButton from "../../buttons/PrimaryButton";
import Heading from "../../Heading";
import RollDropdownInputItem from "./RollDropdownInputItem";
import RollDropdownItem from "./RollDropdownItem";

interface RollDropdownIconButtonProps {
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

const RollDropdownIconButton: React.FC<RollDropdownIconButtonProps> = ({
	isOpen,
	setIsOpen,
	closeAll,
	savedToRolls,
	selectedRoll,
	setSelectedRoll,
	disabled,
}) => {
	const [dropdownPosition, setDropdownPosition] = useState({
		top: 0,
		left: 0,
	});
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
			list.scrollTo({
				top: list.scrollHeight,
				behavior: "smooth",
			});
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
			await createRoll({
				name: newRollName,
			});
			showToast("Roll created successfully", "success");
		} catch {
			showToast("Failed to create roll", "error");
		} finally {
			setIsCreating(false);
			setNewRollName("");
		}
	};

	const dropdownContent = (
		<div
			className="item-start flex w-[200px] origin-top transform flex-col justify-center gap-4 rounded-2xl border border-gray-400 bg-white py-4 text-primary shadow-lg ease-out md:w-[328px]"
			onClick={(e) => e.stopPropagation()}
			ref={dropdownRef}
			style={{
				position: "absolute",
				top: dropdownPosition.top,
				left: dropdownPosition.left,
				zIndex: 9999,
				visibility:
					dropdownPosition.top === 0 && dropdownPosition.left === 0
						? "hidden"
						: "visible",
			}}
		>
			<Heading alignment="center" className="py-2" size="m">
				Rolls
			</Heading>

			<SearchInputField className="ml-2 w-[178px] md:w-[309px]" />

			<ul className="max-h-60 w-full overflow-y-auto" ref={listRef}>
				{isLoading ? (
					<div className="relative flex h-32 w-full items-center justify-center">
						<div className="loading loading-spinner" />
					</div>
				) : (
					<>
						{rolls.length > 0 ? (
							rolls.map((roll) => (
								<RollDropdownItem
									isCreating={isCreating}
									isSaved={savedToRolls.includes(roll._id)}
									key={roll._id}
									onSelectedRoll={() =>
										setSelectedRoll({ id: roll._id, name: roll.name })
									}
									roll={roll}
									selectedRollId={selectedRoll?.id || null}
								/>
							))
						) : (
							<li className="px-4 py-2 text-center text-gray-500">
								No rolls found
							</li>
						)}
						{isCreating && (
							<RollDropdownInputItem
								handleCreateRoll={handleCreateRoll}
								newRollName={newRollName}
								setIsCreating={setIsCreating}
								setNewRollName={setNewRollName}
							/>
						)}
					</>
				)}
			</ul>

			<PrimaryButton
				className="mx-4 mt-2"
				disabled={isLoading}
				onClick={isCreating ? handleCreateRoll : handleCreate}
			>
				{isCreating ? "Add Roll" : "New Roll"}
			</PrimaryButton>
		</div>
	);
	return (
		<div ref={buttonRef}>
			<IconButton
				className="flex cursor-pointer flex-row items-center gap-2 rounded-3xl px-4 py-2 font-semibold outline-0 ring-0"
				color="tertiary"
				disabled={disabled}
				iconPosition={"right"}
				onClick={handleClick}
				paddingX={1}
			>
				<Text size="xs">{selectedRoll ? selectedRoll.name : "All Photos"}</Text>

				<CaretDownIcon weight="bold" />
			</IconButton>

			{isOpen && createPortal(dropdownContent, document.body)}
		</div>
	);
};

export default RollDropdownIconButton;
