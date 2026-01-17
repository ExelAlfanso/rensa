"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import AuthFormLayout from "./AuthFormLayout";
import TextInputField from "@/components/inputfields/TextInputField";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useLoading } from "@/hooks/useLoading";
import { api } from "@/lib/axios-client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { setLoading } = useLoading();

  const validateForm = () => {
    if (!email.trim()) return "Email is required";
    if (!email.includes("@")) return "Invalid email format";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) return setError(errorMsg);

    setLoading(true);
    setError("");
    setMessage("");
    try {
      await api.post("/email/forgot-password", { email });
      setMessage(
        "If your email exists, you will receive a password reset link.",
      );
    } catch {
      setMessage(
        "If your email exists, you will receive a password reset link.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Forgot Password"
      onSubmit={handleSubmit}
      error={error}
      message={message}
      button={
        <PrimaryButton className="h-13 md:h-15.5 my-7" type="submit">
          Send Reset Link
        </PrimaryButton>
      }
      footer={
        <span className="flex items-center justify-center gap-1 text-gray-700">
          Remember your password?
          <Link href="/login" className="text-orange-500">
            Login
          </Link>
        </span>
      }
    >
      <TextInputField
        type="email"
        name="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
    </AuthFormLayout>
  );
}
