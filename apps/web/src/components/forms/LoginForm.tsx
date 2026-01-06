"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import AuthFormLayout from "./AuthFormLayout";
import PasswordInputField from "@/components/inputfields/PasswordInputField";
import { useLoading } from "@/hooks/useLoading";
import { signIn } from "next-auth/react";
import PrimaryButton from "../buttons/PrimaryButton";
import TextInputField from "../inputfields/TextInputField";
import { useSearchParams } from "next/navigation";
import { sanitizeInput } from "@/lib/validation";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { setLoading } = useLoading();
  const searchParams = useSearchParams();
  const infoMessage = sanitizeInput(searchParams.get("message") || "");
  const displayMessage = error ? "" : infoMessage;

  const validateForm = () => {
    if (!form.email.trim()) return "Email is required";
    if (!form.password.trim()) return "Password is required";
    if (!form.email.includes("@")) return "Invalid email format";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) return setError(errorMsg);

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
      title="Login"
      onSubmit={handleSubmit}
      error={error}
      message={displayMessage}
      button={
        <PrimaryButton className="h-[52px] md:h-[62px] my-7" type="submit">
          Login
        </PrimaryButton>
      }
      footer={
        <>
          <Link href="/forgot-password" className="text-gray-700">
            Forgot password?
          </Link>
          <span className="flex items-center justify-center gap-1 text-gray-700">
            No account?
            <Link href="/register" className="text-orange-500">
              Create one
            </Link>
          </span>
        </>
      }
    >
      <TextInputField
        type="email"
        name="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <PasswordInputField
        name="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
    </AuthFormLayout>
  );
}
