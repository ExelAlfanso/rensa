import type React from "react";
import RollCardContainer, {
	type RollCardContainerProps,
} from "@/frontend/features/rolls/containers/RollCardContainer";

export type RollCardProps = RollCardContainerProps;

const RollCard: React.FC<RollCardProps> = (props) => (
	<RollCardContainer {...props} />
);

export default RollCard;
