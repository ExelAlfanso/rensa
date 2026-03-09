"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import AuthFormLayout from "./AuthFormLayout";
import PasswordInputField from "@/frontend/components/inputfields/PasswordInputField";
import PrimaryButton from "@/frontend/components/buttons/PrimaryButton";
import { useLoading } from "@/frontend/hooks/useLoading";
import { api } from "@/lib/axios-client";

interface ResetPasswordFormProps {
  token?: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { setLoading } = useLoading();

  const validateForm = () => {
    if (!token) return "Reset link is invalid or expired.";
    if (!password.trim()) return "Password is required";
    if (password.trim().length < 8)
      return "Password must be at least 8 characters";
    if (password.trim().length > 128) return "Password is too long";
    if (password !== confirmPassword) return "Passwords do not match";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) return setError(errorMsg);

    setLoading(true);
    setError("");
    setMessage("");
    try {
      await api.post("/auth/reset-password", {
        token,
        password,
        confirmPassword,
      });
      setMessage("Password reset successful. You can now log in.");
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Reset Password"
      onSubmit={handleSubmit}
      error={error}
      message={message}
      button={
        <PrimaryButton
          className="h-13 md:h-15.5 my-7"
          type="submit"
          disabled={!token}
        >
          Reset Password
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
      <PasswordInputField
        name="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordInputField
        name="confirmPassword"
        placeholder="Confirm New Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </AuthFormLayout>
  );
}
