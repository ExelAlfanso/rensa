"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useLoading } from "@/frontend/hooks/use-loading";
import { api } from "@/lib/axios-client";
import PrimaryButton from "../buttons/PrimaryButton";
import TextInputField from "../inputfields/TextInputField";
import AuthFormLayout from "./AuthFormLayout";

export default function RegisterForm() {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const router = useRouter();
	const { setLoading } = useLoading();

	const validateForm = () => {
		if (form.password !== form.confirmPassword) {
			return "Passwords do not match";
		}
		if (!form.email.trim()) {
			return "Email is required";
		}
		if (!form.password.trim()) {
			return "Password is required";
		}
		if (!form.username.trim()) {
			return "Username is required";
		}
		if (!form.email.includes("@")) {
			return "Invalid email format";
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const errorMsg = validateForm();
		if (errorMsg) {
			return setError(errorMsg);
		}

		setLoading(true);
		try {
			await api.post("/auth/register", form);
			await signIn("credentials", {
				email: form.email,
				password: form.password,
				redirect: false,
			});

			const message = encodeURIComponent(
				"Sent a verification to your email. Please verify to continue."
			);
			router.push(`/login?message=${message}`);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(
					err.response?.data?.message ||
						"Something went wrong. Please try again."
				);
			} else {
				setError("Unknown error occurred");
			}
		} finally {
			setLoading(false);
		}
	};

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
			onSubmit={handleSubmit}
			title="Register"
		>
			<TextInputField
				name="username"
				onChange={(e) => setForm({ ...form, username: e.target.value })}
				placeholder="Username"
				type="text"
			/>
			<TextInputField
				name="email"
				onChange={(e) => setForm({ ...form, email: e.target.value })}
				placeholder="Email"
				type="email"
			/>
			<TextInputField
				name="password"
				onChange={(e) => setForm({ ...form, password: e.target.value })}
				placeholder="Password"
				type="password"
			/>
			<TextInputField
				name="confirmPassword"
				onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
				placeholder="Confirm Password"
				type="password"
			/>
		</AuthFormLayout>
	);
}
