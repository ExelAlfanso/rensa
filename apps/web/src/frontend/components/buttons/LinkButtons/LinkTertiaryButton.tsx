import TertiaryButton from "../TertiaryButton";
import type { LinkButtonProps } from "./LinkPrimaryButton";

const LinkTertiaryButton: React.FC<LinkButtonProps> = ({
	href,
	className,
	children,
}) => (
	<TertiaryButton className={className} href={href}>
		{children}
	</TertiaryButton>
);

export default LinkTertiaryButton;
