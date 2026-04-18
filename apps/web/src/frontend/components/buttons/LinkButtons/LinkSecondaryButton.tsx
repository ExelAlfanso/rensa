import SecondaryButton from "../SecondaryButton";
import type { LinkButtonProps } from "./LinkPrimaryButton";

const LinkSecondaryButton: React.FC<LinkButtonProps> = ({
	href,
	className,
	children,
}) => {
	return (
		<SecondaryButton className={className} href={href}>
			{children}
		</SecondaryButton>
	);
};

export default LinkSecondaryButton;
