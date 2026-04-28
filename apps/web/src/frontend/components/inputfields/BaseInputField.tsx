// BaseInputField.tsx
import type React from "react";

interface BaseInputFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

const BaseInputField: React.FC<BaseInputFieldProps> = ({ label, ...props }) => (
	<div className="flex flex-col">
		{label && (
			<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
				{label}
			</label>
		)}
		<input
			{...props}
			className="h-12 w-full rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-16 md:py-4"
		/>
	</div>
);

export default BaseInputField;
