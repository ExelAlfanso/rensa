"use client";

import { useState } from "react";
import { useLoading } from "@/frontend/hooks/use-loading";
import { useToast } from "@/frontend/providers/ToastProvider";
import BugReportFormView, {
	type BugReportFormState,
} from "../components/BugReportFormView";

const initialBugReportState: BugReportFormState = {
	title: "",
	email: "",
	description: "",
	stepsToReproduce: "",
	expectedBehavior: "",
	actualBehavior: "",
	browser: "",
	attachments: "",
};

const BugReportFormContainer = () => {
	const [form, setForm] = useState<BugReportFormState>(initialBugReportState);
	const [error, setError] = useState("");
	const { setLoading } = useLoading();
	const { showToast } = useToast();

	const validateForm = () => {
		if (!form.title.trim()) {
			return "Bug title is required";
		}
		if (!form.email.trim()) {
			return "Email is required";
		}
		if (!form.email.includes("@")) {
			return "Invalid email format";
		}
		if (!form.description.trim()) {
			return "Description is required";
		}
		if (!form.expectedBehavior.trim()) {
			return "Expected behavior is required";
		}
		if (!form.actualBehavior.trim()) {
			return "Actual behavior is required";
		}
	};

	const handleChange = (field: keyof BugReportFormState, value: string) => {
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
			const response = await fetch("/api/bug-reports", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Failed to submit bug report");
			}

			showToast("Thank you! Your bug report has been submitted.", "success");
			setForm(initialBugReportState);
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
		<BugReportFormView
			error={error}
			onChange={handleChange}
			onSubmit={handleSubmit}
			values={form}
		/>
	);
};

export default BugReportFormContainer;
