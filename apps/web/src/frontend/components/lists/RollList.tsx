import RollCard from "@/frontend/components/cards/RollCard";
import CreateNewRollCard from "../cards/CreateNewRollCard";

export interface Roll {
	_id: string;
	createdAt: string;
	name: string;
	previewPhotos: string[];
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
						id={roll._id}
						imageUrls={roll.previewPhotos}
						key={roll._id}
						name={roll.name}
						userId={roll.userId}
					/>
				))}
		</div>
	);
}
