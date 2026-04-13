import type React from "react";
import UploadFormContainer, {
	type UploadFormContainerProps,
} from "@/frontend/features/upload/containers/UploadFormContainer";

type UploadFormProps = UploadFormContainerProps;

const UploadForm: React.FC<UploadFormProps> = (props) => {
	return <UploadFormContainer {...props} />;
};

export default UploadForm;
