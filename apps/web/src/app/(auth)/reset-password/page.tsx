import ResetPasswordForm from "@/components/forms/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white-200">
      <ResetPasswordForm token={token} />
    </div>
  );
}
