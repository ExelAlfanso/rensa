import type React from "react";

interface TextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
}
const TextAreaInputField: React.FC<TextAreaProps> = ({ label, ...props }) => (
	<div className="flex flex-col">
		{label && (
			<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
				{label}
			</label>
		)}
		<textarea
			{...props}
			className="w-full rounded-3xl bg-gray-200 px-4 py-3 text-[16px] text-sm focus:bg-[#FAFAFA] focus:outline-gray-800"
			rows={6}
		/>
	</div>
);

export default TextAreaInputField;
