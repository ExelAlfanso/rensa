import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SwaggerClient from "./SwaggerClient";

export default async function SwaggerPage() {
	const session = await getServerSession(authOptions);
	if (session?.user?.role !== "admin") {
		notFound();
	}

	return <SwaggerClient />;
}
