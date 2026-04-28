"use client";

import { useState } from "react";
import { useLoading } from "@/frontend/features/common/hooks/use-loading";
import { useToast } from "@/frontend/providers/ToastProvider";
import ContactFormView, {
	type ContactFormState,
} from "../components/ContactFormView";

const initialContactState: ContactFormState = {
	name: "",
	email: "",
	subject: "",
	message: "",
};

const ContactFormContainer = () => {
	const [form, setForm] = useState<ContactFormState>(initialContactState);
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

	const handleChange = (field: keyof ContactFormState, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const errorMessage = validateForm();
		if (errorMessage) {
			setError(errorMessage);
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
			setForm(initialContactState);
		} catch (errorValue) {
			const errorMessage =
				errorValue instanceof Error ? errorValue.message : "An error occurred";
			setError(errorMessage);
			showToast(errorMessage, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ContactFormView
			error={error}
			onChange={handleChange}
			onSubmit={handleSubmit}
			values={form}
		/>
	);
};

export default ContactFormContainer;
