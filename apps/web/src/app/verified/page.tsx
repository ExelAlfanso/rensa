import { notFound } from "next/navigation";
import { api } from "@/lib/axios-client";
import VerifiedClient from "./VerifiedClient";

async function checkTokenValidity(token?: string) {
	try {
		const secret = process.env.NEXTAUTH_SECRET;
		if (!(token && secret)) {
			return false;
		}
		await api.post("/auth/verify-email", { token });
		return true;
	} catch (_err) {
		return false;
	}
}

export default async function VerifiedPage({
	searchParams,
}: {
	searchParams: { token?: string };
}) {
	const { token } = searchParams;
	const isValid = await checkTokenValidity(token);

	if (!isValid) {
		notFound();
	}

	return <VerifiedClient />;
}
