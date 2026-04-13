"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { type FormEvent, useState } from "react";
import PasswordInputField from "@/frontend/components/inputfields/PasswordInputField";
import { useLoading } from "@/frontend/hooks/use-loading";
import { sanitizeInput } from "@/lib/validation";
import PrimaryButton from "../buttons/PrimaryButton";
import TextInputField from "../inputfields/TextInputField";
import AuthFormLayout from "./AuthFormLayout";

export default function LoginForm() {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const { setLoading } = useLoading();
	const searchParams = useSearchParams();
	const infoMessage = sanitizeInput(searchParams.get("message") || "");
	const displayMessage = error ? "" : infoMessage;

	const validateForm = () => {
		if (!form.email.trim()) {
			return "Email is required";
		}
		if (!form.password.trim()) {
			return "Password is required";
		}
		if (!form.email.includes("@")) {
			return "Invalid email format";
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const errorMsg = validateForm();
		if (errorMsg) {
			return setError(errorMsg);
		}

		setLoading(true);
		const res = await signIn("credentials", {
			email: form.email,
			password: form.password,
			redirect: false,
			callbackUrl: "/explore",
		});
		if (res?.error) {
			setError(res.error);
		} else {
			window.location.href = res?.url || "/explore";
		}
		setLoading(false);
	};

	return (
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
			message={displayMessage}
			onSubmit={handleSubmit}
			title="Login"
		>
			<TextInputField
				name="email"
				onChange={(e) => setForm({ ...form, email: e.target.value })}
				placeholder="Email"
				type="email"
			/>
			<PasswordInputField
				name="password"
				onChange={(e) => setForm({ ...form, password: e.target.value })}
				placeholder="Password"
			/>
		</AuthFormLayout>
	);
}
