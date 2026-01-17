import { notFound } from "next/navigation";
import VerifiedClient from "./VerifiedClient";
import { api } from "@/lib/axios-client";

async function checkTokenValidity(token?: string) {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!token || !secret) return false;
    await api.post("/auth/verify-email", { token });
    return true;
  } catch (err) {
    return false;
  }
}

export default async function VerifiedPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const { token } = await searchParams;
  let isValid = await checkTokenValidity(token);

  if (!isValid) {
    notFound();
  }

  return <VerifiedClient />;
}
