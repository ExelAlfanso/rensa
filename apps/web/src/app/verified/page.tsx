import { notFound } from "next/navigation";
import jwt from "jsonwebtoken";

import VerifiedClient from "./VerifiedClient";

type VerifiedPageProps = {
  searchParams?: {
    token?: string;
  };
};

function checkTokenValidity(token?: string) {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!token || !secret) return false;

    jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
}

export default function VerifiedPage({ searchParams }: VerifiedPageProps) {
  const token = searchParams?.token;
  const isValid = checkTokenValidity(token);

  if (!isValid) {
    notFound();
  }

  return <VerifiedClient />;
}
