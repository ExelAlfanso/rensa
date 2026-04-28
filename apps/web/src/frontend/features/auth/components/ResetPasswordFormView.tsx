"use client";

import Link from "next/link";
import type React from "react";
import PrimaryButton from "@/frontend/components/buttons/PrimaryButton";
import AuthFormLayout from "@/frontend/components/forms/AuthFormLayout";
import PasswordInputField from "@/frontend/components/inputfields/PasswordInputField";

interface ResetPasswordFormViewProps {
	error: string;
	message: string;
	onChangeConfirmPassword: (value: string) => void;
	onChangePassword: (value: string) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
	token?: string;
}

const ResetPasswordFormView = ({
	token,
	error,
	message,
	onSubmit,
	onChangePassword,
	onChangeConfirmPassword,
}: ResetPasswordFormViewProps) => {
	return (
		<AuthFormLayout
			button={
				<PrimaryButton
					className="my-7 h-13 md:h-15.5"
					disabled={!token}
					type="submit"
				>
					Reset Password
				</PrimaryButton>
			}
			error={error}
			footer={
				<span className="flex items-center justify-center gap-1 text-gray-700">
					Remember your password?
					<Link className="text-orange-500" href="/login">
						Login
					</Link>
				</span>
			}
			message={message}
			onSubmit={onSubmit}
			title="Reset Password"
		>
			<PasswordInputField
				name="password"
				onChange={(event) => onChangePassword(event.target.value)}
				placeholder="New Password"
			/>
			<PasswordInputField
				name="confirmPassword"
				onChange={(event) => onChangeConfirmPassword(event.target.value)}
				placeholder="Confirm New Password"
			/>
		</AuthFormLayout>
	);
};

export default ResetPasswordFormView;
