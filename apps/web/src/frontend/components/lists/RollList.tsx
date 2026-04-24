import RollCard from "@/frontend/components/cards/RollCard";
import CreateNewRollCard from "../cards/CreateNewRollCard";

export interface Roll {
	createdAt: string;
	name: string;
	previewPhotos: string[];
	roll_id: string;
	userId: string;
}

interface RollListProps {
	isOwner: boolean;
	rolls: Roll[];
}

export default function RollList({ rolls, isOwner }: RollListProps) {
	return (
		<div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
			{isOwner && <CreateNewRollCard key="create-new-roll" />}
			{rolls?.length > 0 &&
				rolls.map((roll) => (
					<RollCard
						createdAt={roll.createdAt}
						id={roll.roll_id}
						imageUrls={roll.previewPhotos}
						key={roll.roll_id}
						name={roll.name}
						userId={roll.userId}
					/>
				))}
		</div>
	);
}
