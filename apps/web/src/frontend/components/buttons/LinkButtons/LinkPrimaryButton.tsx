import PrimaryButton from "../PrimaryButton";

export interface LinkButtonProps {
	children?: React.ReactNode;
	className?: string;
	href: string;
}
const LinkPrimaryButton: React.FC<LinkButtonProps> = ({
	href,
	className,
	children,
}) => (
	<PrimaryButton className={className} href={href}>
		{children}
	</PrimaryButton>
);

export default LinkPrimaryButton;
