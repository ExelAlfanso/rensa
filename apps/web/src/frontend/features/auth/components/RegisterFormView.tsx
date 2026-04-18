"use client";

import Link from "next/link";
import type React from "react";
import PrimaryButton from "@/frontend/components/buttons/PrimaryButton";
import AuthFormLayout from "@/frontend/components/forms/AuthFormLayout";
import TextInputField from "@/frontend/components/inputfields/TextInputField";

interface RegisterFormState {
	confirmPassword: string;
	email: string;
	password: string;
	username: string;
}

interface RegisterFormViewProps {
	error: string;
	form: RegisterFormState;
	onChange: (field: keyof RegisterFormState, value: string) => void;
	onSubmit: (event: React.FormEvent) => Promise<void>;
}

const RegisterFormView: React.FC<RegisterFormViewProps> = ({
	error,
	form,
	onChange,
	onSubmit,
}) => {
	return (
		<AuthFormLayout
			button={
				<PrimaryButton className="my-7 h-13 md:h-15.5" type="submit">
					Register
				</PrimaryButton>
			}
			error={error}
			footer={
				<span className="flex items-center justify-center gap-1 text-gray-700">
					Have an account?
					<Link className="text-orange-500" href="/login">
						Login
					</Link>
				</span>
			}
			onSubmit={onSubmit}
			title="Register"
		>
			<TextInputField
				name="username"
				onChange={(event) => onChange("username", event.target.value)}
				placeholder="Username"
				type="text"
				value={form.username}
			/>
			<TextInputField
				name="email"
				onChange={(event) => onChange("email", event.target.value)}
				placeholder="Email"
				type="email"
				value={form.email}
			/>
			<TextInputField
				name="password"
				onChange={(event) => onChange("password", event.target.value)}
				placeholder="Password"
				type="password"
				value={form.password}
			/>
			<TextInputField
				name="confirmPassword"
				onChange={(event) => onChange("confirmPassword", event.target.value)}
				placeholder="Confirm Password"
				type="password"
				value={form.confirmPassword}
			/>
		</AuthFormLayout>
	);
};

export type { RegisterFormState };
export default RegisterFormView;
