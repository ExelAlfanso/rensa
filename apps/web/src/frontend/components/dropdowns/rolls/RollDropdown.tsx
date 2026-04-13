import { CaretDownIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

interface RollDropdownProps {
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

const RollDropdown: React.FC<RollDropdownProps> = ({
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
	const [dropdownPosition, setDropdownPosition] = useState({
		top: 0,
		left: 0,
	});
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

	useEffect(() => {
		if (isOpen) {
			fetchRolls();
			// updateDropdownPosition();
			const button = buttonRef.current;
			const dropdown = dropdownRef.current;

			if (button && dropdown) {
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
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, fetchRolls, dropdownRef.current]);

	useEffect(() => {
		const handleResize = () => {
			setIsOpen(false);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dropdownRef.current, setIsOpen]);

	const handleCreate = () => {
		setIsCreating(true);
		setNewRollName("");
	};

	const handleCreateRoll = async () => {
		if (!newRollName.trim()) {
			return;
		}
		// console.log("Saving new roll:", newRollName);
		try {
			await createRoll({
				name: newRollName,
			});
			showToast("Roll created successfully", "success");
		} catch (error) {
			showToast("Failed to create roll", "error");
			console.error("Failed to create roll:", error);
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
		<div>
			<button
				className="flex cursor-pointer flex-row items-center gap-2 rounded-3xl px-4 py-2 font-semibold outline-0 ring-0"
				disabled={disabled}
				onClick={handleClick}
				ref={buttonRef}
			>
				<Text size="xs">{selectedRoll ? selectedRoll.name : "None"}</Text>

				{!disabled && <CaretDownIcon weight="bold" />}
			</button>

			{isOpen && createPortal(dropdownContent, document.body)}
		</div>
	);
};

export default RollDropdown;
