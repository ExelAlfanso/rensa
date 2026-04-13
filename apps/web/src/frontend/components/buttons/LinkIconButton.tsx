"use client";

import type React from "react";
import LinkIconButtonContainer, {
	type LinkIconButtonContainerProps,
} from "@/frontend/features/common/containers/LinkIconButtonContainer";

export type LinkIconButtonProps = LinkIconButtonContainerProps;

const LinkIconButton: React.FC<LinkIconButtonProps> = (props) => {
	return <LinkIconButtonContainer {...props} />;
};

export default LinkIconButton;
