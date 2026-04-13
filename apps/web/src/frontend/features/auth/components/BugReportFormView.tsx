"use client";

import type React from "react";
import PrimaryButton from "@/frontend/components/buttons/PrimaryButton";
import AuthFormLayout from "@/frontend/components/forms/AuthFormLayout";
import TextInputField from "@/frontend/components/inputfields/TextInputField";

interface BugReportFormState {
	actualBehavior: string;
	attachments: string;
	browser: string;
	description: string;
	email: string;
	expectedBehavior: string;
	stepsToReproduce: string;
	title: string;
}

interface BugReportFormViewProps {
	error: string;
	onChange: (field: keyof BugReportFormState, value: string) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
	values: BugReportFormState;
}

const BugReportFormView = ({
	error,
	onSubmit,
	onChange,
	values,
}: BugReportFormViewProps) => {
	return (
		<AuthFormLayout
			button={
				<PrimaryButton className="my-7 h-13 w-full md:h-15.5" type="submit">
					Submit Report
				</PrimaryButton>
			}
			error={error}
			onSubmit={onSubmit}
			title="Report a Bug"
		>
			<TextInputField
				label="Bug Title"
				onChange={(event) => onChange("title", event.target.value)}
				placeholder="Brief summary of the issue"
				value={values.title}
			/>
			<TextInputField
				label="Email"
				onChange={(event) => onChange("email", event.target.value)}
				placeholder="your.email@example.com"
				type="email"
				value={values.email}
			/>
			<div className="flex flex-col">
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					Description
				</label>
				<textarea
					className="h-28 w-full resize-none rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-32 md:py-4"
					onChange={(event) => onChange("description", event.target.value)}
					placeholder="Describe the bug in detail..."
					value={values.description}
				/>
			</div>
			<div className="flex flex-col">
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					Steps to Reproduce
				</label>
				<textarea
					className="h-24 w-full resize-none rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-28 md:py-4"
					onChange={(event) => onChange("stepsToReproduce", event.target.value)}
					placeholder="1. First step&#10;2. Second step&#10;3. And so on..."
					value={values.stepsToReproduce}
				/>
			</div>
			<div className="flex flex-col">
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					Expected Behavior
				</label>
				<textarea
					className="h-24 w-full resize-none rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-28 md:py-4"
					onChange={(event) => onChange("expectedBehavior", event.target.value)}
					placeholder="What should happen..."
					value={values.expectedBehavior}
				/>
			</div>
			<div className="flex flex-col">
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					Actual Behavior
				</label>
				<textarea
					className="h-24 w-full resize-none rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-28 md:py-4"
					onChange={(event) => onChange("actualBehavior", event.target.value)}
					placeholder="What actually happens..."
					value={values.actualBehavior}
				/>
			</div>
			<TextInputField
				label="Browser (Optional)"
				onChange={(event) => onChange("browser", event.target.value)}
				placeholder="e.g., Chrome 120, Firefox 121"
				value={values.browser}
			/>
			<TextInputField
				label="Additional Info (Optional)"
				onChange={(event) => onChange("attachments", event.target.value)}
				placeholder="Screenshots, error messages, etc."
				value={values.attachments}
			/>
		</AuthFormLayout>
	);
};

export type { BugReportFormState };
export default BugReportFormView;
