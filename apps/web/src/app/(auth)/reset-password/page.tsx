import ResetPasswordForm from "@/frontend/components/forms/ResetPasswordForm";

export default async function ResetPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;

	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center bg-white-200">
			<ResetPasswordForm token={token} />
		</div>
	);
}
