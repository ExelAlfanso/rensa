"use client";
import { useState, FormEvent } from "react";
import AuthFormLayout from "./AuthFormLayout";
import TextInputField from "@/frontend/components/inputfields/TextInputField";
import PrimaryButton from "../buttons/PrimaryButton";
import { useLoading } from "@/frontend/hooks/useLoading";
import { useToast } from "@/frontend/providers/ToastProvider";

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
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.email.includes("@")) return "Invalid email format";
    if (!form.subject.trim()) return "Subject is required";
    if (!form.message.trim()) return "Message is required";
    if (form.message.length < 10)
      return "Message must be at least 10 characters";
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
      title="Contact Us"
      onSubmit={handleSubmit}
      error={error}
      button={
        <PrimaryButton
          className="h-[52px] md:h-[62px] my-7 w-full"
          type="submit"
        >
          Send Message
        </PrimaryButton>
      }
    >
      <TextInputField
        label="Name"
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <TextInputField
        label="Email"
        type="email"
        placeholder="your.email@example.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <TextInputField
        label="Subject"
        placeholder="What is this about?"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />
      <div className="flex flex-col">
        <label className="text-[13px] text-black-200 font-figtree font-medium mb-1">
          Message
        </label>
        <textarea
          placeholder="Tell us more about your inquiry..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full pl-6 pr-4 bg-gray-200 rounded-3xl px-4 py-3 text-[16px] focus:outline-gray-800 focus:bg-[#FAFAFA] md:py-4 text-black placeholder:text-black-300 font-figtree resize-none h-32 md:h-40"
        />
      </div>
    </AuthFormLayout>
  );
}
