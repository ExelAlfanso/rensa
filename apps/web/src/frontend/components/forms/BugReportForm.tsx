"use client";
import { type FormEvent, useState } from "react";
import TextInputField from "@/frontend/components/inputfields/TextInputField";
import { useLoading } from "@/frontend/hooks/use-loading";
import { useToast } from "@/frontend/providers/ToastProvider";
import PrimaryButton from "../buttons/PrimaryButton";
import AuthFormLayout from "./AuthFormLayout";

export default function BugReportForm() {
	const [form, setForm] = useState({
		title: "",
		email: "",
		description: "",
		stepsToReproduce: "",
		expectedBehavior: "",
		actualBehavior: "",
		browser: "",
		attachments: "",
	});
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
			setForm({
				title: "",
				email: "",
				description: "",
				stepsToReproduce: "",
				expectedBehavior: "",
				actualBehavior: "",
				browser: "",
				attachments: "",
			});
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
				<PrimaryButton
					className="my-7 h-[52px] w-full md:h-[62px]"
					type="submit"
				>
					Submit Report
				</PrimaryButton>
			}
			error={error}
			onSubmit={handleSubmit}
			title="Report a Bug"
		>
			<TextInputField
				label="Bug Title"
				onChange={(e) => setForm({ ...form, title: e.target.value })}
				placeholder="Brief summary of the issue"
				value={form.title}
			/>
			<TextInputField
				label="Email"
				onChange={(e) => setForm({ ...form, email: e.target.value })}
				placeholder="your.email@example.com"
				type="email"
				value={form.email}
			/>
			<div className="flex flex-col">
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					Description
				</label>
				<textarea
					className="h-28 w-full resize-none rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-32 md:py-4"
					onChange={(e) => setForm({ ...form, description: e.target.value })}
					placeholder="Describe the bug in detail..."
					value={form.description}
				/>
			</div>
			<div className="flex flex-col">
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					Steps to Reproduce
				</label>
				<textarea
					className="h-24 w-full resize-none rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-28 md:py-4"
					onChange={(e) =>
						setForm({ ...form, stepsToReproduce: e.target.value })
					}
					placeholder="1. First step&#10;2. Second step&#10;3. And so on..."
					value={form.stepsToReproduce}
				/>
			</div>
			<div className="flex flex-col">
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					Expected Behavior
				</label>
				<textarea
					className="h-24 w-full resize-none rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-28 md:py-4"
					onChange={(e) =>
						setForm({ ...form, expectedBehavior: e.target.value })
					}
					placeholder="What should happen..."
					value={form.expectedBehavior}
				/>
			</div>
			<div className="flex flex-col">
				<label className="mb-1 font-figtree font-medium text-[13px] text-black-200">
					Actual Behavior
				</label>
				<textarea
					className="h-24 w-full resize-none rounded-3xl bg-gray-200 px-4 py-3 pr-4 pl-6 font-figtree text-[16px] text-black placeholder:text-black-300 focus:bg-[#FAFAFA] focus:outline-gray-800 md:h-28 md:py-4"
					onChange={(e) => setForm({ ...form, actualBehavior: e.target.value })}
					placeholder="What actually happens..."
					value={form.actualBehavior}
				/>
			</div>
			<TextInputField
				label="Browser (Optional)"
				onChange={(e) => setForm({ ...form, browser: e.target.value })}
				placeholder="e.g., Chrome 120, Firefox 121"
				value={form.browser}
			/>
			<TextInputField
				label="Additional Info (Optional)"
				onChange={(e) => setForm({ ...form, attachments: e.target.value })}
				placeholder="Screenshots, error messages, etc."
				value={form.attachments}
			/>
		</AuthFormLayout>
	);
}
