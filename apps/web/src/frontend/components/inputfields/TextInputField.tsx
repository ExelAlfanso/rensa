import type React from "react";
import BaseInputField from "./BaseInputField";

const TextInput = (props: React.ComponentProps<typeof BaseInputField>) => (
	<BaseInputField type="text" {...props} />
);

export default TextInput;
