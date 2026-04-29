"use client";

import Link from "next/link";
import type React from "react";
import PrimaryButton from "@/frontend/components/buttons/PrimaryButton";
import AuthFormLayout from "@/frontend/components/forms/AuthFormLayout";
import PasswordInputField from "@/frontend/components/inputfields/PasswordInputField";
import TextInputField from "@/frontend/components/inputfields/TextInputField";

interface LoginFormState {
	email: string;
	password: string;
}

interface LoginFormViewProps {
	error: string;
	message: string;
	onChange: (field: keyof LoginFormState, value: string) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
	values: LoginFormState;
}

const LoginFormView = ({
	error,
	message,
	onSubmit,
	onChange,
	values,
}: LoginFormViewProps) => (
	<AuthFormLayout
		button={
			<PrimaryButton className="my-7 h-13 md:h-15.5" type="submit">
				Login
			</PrimaryButton>
		}
		error={error}
		footer={
			<>
				<Link className="text-gray-700" href="/forgot-password">
					Forgot password?
				</Link>
				<span className="flex items-center justify-center gap-1 text-gray-700">
					No account?
					<Link className="text-orange-500" href="/register">
						Create one
					</Link>
				</span>
			</>
		}
		message={message}
		onSubmit={onSubmit}
		title="Login"
	>
		<TextInputField
			name="email"
			onChange={(event) => onChange("email", event.target.value)}
			placeholder="Email"
			type="email"
			value={values.email}
		/>
		<PasswordInputField
			name="password"
			onChange={(event) => onChange("password", event.target.value)}
			placeholder="Password"
		/>
	</AuthFormLayout>
);

export type { LoginFormState };
export default LoginFormView;
