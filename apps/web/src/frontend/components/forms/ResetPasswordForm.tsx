"use client";
import ResetPasswordFormContainer, {
	type ResetPasswordFormContainerProps,
} from "@/frontend/features/auth/containers/ResetPasswordFormContainer";

type ResetPasswordFormProps = ResetPasswordFormContainerProps;

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
	return <ResetPasswordFormContainer token={token} />;
}
