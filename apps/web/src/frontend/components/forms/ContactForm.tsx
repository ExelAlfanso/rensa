"use client";
import { type FormEvent, useState } from "react";
import TextInputField from "@/frontend/components/inputfields/TextInputField";
import { useLoading } from "@/frontend/hooks/use-loading";
import { useToast } from "@/frontend/providers/ToastProvider";
import PrimaryButton from "../buttons/PrimaryButton";
import AuthFormLayout from "./AuthFormLayout";

export default function ContactForm() {
	const [form, setForm] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [error, setError] = useState("");
	const { setLoading } = useLoading();
	const { showToast } = useToast();

	const validateForm = () => {
		if (!form.name.trim()) {
			return "Name is required";
		}
		if (!form.email.trim()) {
			return "Email is required";
		}
		if (!form.email.includes("@")) {
			return "Invalid email format";
		}
		if (!form.subject.trim()) {
			return "Subject is required";
		}
		if (!form.message.trim()) {
			return "Message is required";
		}
		if (form.message.length < 10) {
			return "Message must be at least 10 characters";
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const errorMsg = validateForm();
		if (errorMsg) {
			setError(errorMsg);
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to send message");
			}

			showToast("Your message has been sent successfully!", "success");
			setForm({ name: "", email: "", subject: "", message: "" });
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "An error occurred";
			setError(errorMessage);
			showToast(errorMessage, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthFormLayout
			button={
				<PrimaryButton className="my-7 h-13 w-full md:h-15.5" type="submit">
					Send Message
				</PrimaryButton>
			}
			error={error}
			onSubmit={handleSubmit}
			title="Contact Us"
		>
			<TextInputField
				label="Name"
				onChange={(e) => setForm({ ...form, name: e.target.value })}
				placeholder="Your name"
				value={form.name}
			/>
			<TextInputField
				label="Email"
				onChange={(e) => setForm({ ...form, email: e.target.value })}
				placeholder="your.email@example.com"
				type="email"
				value={form.email}
			/>
			<TextInputField
				label="Subject"
				onChange={(e) => setForm({ ...form, subject: e.target.value })}
				placeholder="What is this about?"
				value={form.subject}
			/>
			<div className="flex flex-col">
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					Message
				</label>
				<textarea
					className="h-32 w-full resize-none rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-40 md:py-4"
					onChange={(e) => setForm({ ...form, message: e.target.value })}
					placeholder="Tell us more about your inquiry..."
					value={form.message}
				/>
			</div>
		</AuthFormLayout>
	);
}
