"use client";

import type React from "react";
import PrimaryButton from "@/frontend/components/buttons/PrimaryButton";
import AuthFormLayout from "@/frontend/components/forms/AuthFormLayout";
import TextInputField from "@/frontend/components/inputfields/TextInputField";

interface ContactFormState {
	email: string;
	message: string;
	name: string;
	subject: string;
}

interface ContactFormViewProps {
	error: string;
	onChange: (field: keyof ContactFormState, value: string) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
	values: ContactFormState;
}

const ContactFormView = ({
	error,
	onSubmit,
	onChange,
	values,
}: ContactFormViewProps) => (
	<AuthFormLayout
		button={
			<PrimaryButton className="my-7 h-13 w-full md:h-15.5" type="submit">
				Send Message
			</PrimaryButton>
		}
		error={error}
		onSubmit={onSubmit}
		title="Contact Us"
	>
		<TextInputField
			label="Name"
			onChange={(event) => onChange("name", event.target.value)}
			placeholder="Your name"
			value={values.name}
		/>
		<TextInputField
			label="Email"
			onChange={(event) => onChange("email", event.target.value)}
			placeholder="your.email@example.com"
			type="email"
			value={values.email}
		/>
		<TextInputField
			label="Subject"
			onChange={(event) => onChange("subject", event.target.value)}
			placeholder="What is this about?"
			value={values.subject}
		/>
		<div className="flex flex-col">
			<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
				Message
			</label>
			<textarea
				className="h-32 w-full resize-none rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-40 md:py-4"
				onChange={(event) => onChange("message", event.target.value)}
				placeholder="Tell us more about your inquiry..."
				value={values.message}
			/>
		</div>
	</AuthFormLayout>
);

export type { ContactFormState };
export default ContactFormView;
