"use client";
import { useState, FormEvent } from "react";
import AuthFormLayout from "./AuthFormLayout";
import TextInputField from "@/components/inputfields/TextInputField";
import PrimaryButton from "../buttons/PrimaryButton";
import { useLoading } from "@/hooks/useLoading";
import { useToast } from "@/providers/ToastProvider";

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
    if (!form.title.trim()) return "Bug title is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.email.includes("@")) return "Invalid email format";
    if (!form.description.trim()) return "Description is required";
    if (!form.expectedBehavior.trim()) return "Expected behavior is required";
    if (!form.actualBehavior.trim()) return "Actual behavior is required";
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
      title="Report a Bug"
      onSubmit={handleSubmit}
      error={error}
      button={
        <PrimaryButton
          className="h-[52px] md:h-[62px] my-7 w-full"
          type="submit"
        >
          Submit Report
        </PrimaryButton>
      }
    >
      <TextInputField
        label="Bug Title"
        placeholder="Brief summary of the issue"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <TextInputField
        label="Email"
        type="email"
        placeholder="your.email@example.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <div className="flex flex-col">
        <label className="text-[13px] text-black-200 font-figtree font-medium mb-1">
          Description
        </label>
        <textarea
          placeholder="Describe the bug in detail..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full pl-6 pr-4 bg-gray-200 rounded-3xl px-4 py-3 text-[16px] focus:outline-gray-800 focus:bg-[#FAFAFA] md:py-4 text-black placeholder:text-black-300 font-figtree resize-none h-28 md:h-32"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-[13px] text-black-200 font-figtree font-medium mb-1">
          Steps to Reproduce
        </label>
        <textarea
          placeholder="1. First step&#10;2. Second step&#10;3. And so on..."
          value={form.stepsToReproduce}
          onChange={(e) =>
            setForm({ ...form, stepsToReproduce: e.target.value })
          }
          className="w-full pl-6 pr-4 bg-gray-200 rounded-3xl px-4 py-3 text-[16px] focus:outline-gray-800 focus:bg-[#FAFAFA] md:py-4 text-black placeholder:text-black-300 font-figtree resize-none h-24 md:h-28"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-[13px] text-black-200 font-figtree font-medium mb-1">
          Expected Behavior
        </label>
        <textarea
          placeholder="What should happen..."
          value={form.expectedBehavior}
          onChange={(e) =>
            setForm({ ...form, expectedBehavior: e.target.value })
          }
          className="w-full pl-6 pr-4 bg-gray-200 rounded-3xl px-4 py-3 text-[16px] focus:outline-gray-800 focus:bg-[#FAFAFA] md:py-4 text-black placeholder:text-black-300 font-figtree resize-none h-24 md:h-28"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-[13px] text-black-200 font-figtree font-medium mb-1">
          Actual Behavior
        </label>
        <textarea
          placeholder="What actually happens..."
          value={form.actualBehavior}
          onChange={(e) => setForm({ ...form, actualBehavior: e.target.value })}
          className="w-full pl-6 pr-4 bg-gray-200 rounded-3xl px-4 py-3 text-[16px] focus:outline-gray-800 focus:bg-[#FAFAFA] md:py-4 text-black placeholder:text-black-300 font-figtree resize-none h-24 md:h-28"
        />
      </div>
      <TextInputField
        label="Browser (Optional)"
        placeholder="e.g., Chrome 120, Firefox 121"
        value={form.browser}
        onChange={(e) => setForm({ ...form, browser: e.target.value })}
      />
      <TextInputField
        label="Additional Info (Optional)"
        placeholder="Screenshots, error messages, etc."
        value={form.attachments}
        onChange={(e) => setForm({ ...form, attachments: e.target.value })}
      />
    </AuthFormLayout>
  );
}
