type EmailVerificationTemplateProps = {
  verificationLink: string;
};

export function EmailVerificationTemplate({
  verificationLink,
}: EmailVerificationTemplateProps) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-[#f7f8f5] p-6 font-sans text-[#0f1b0f]">
      <h2 className="text-2xl font-semibold text-gray-900">
        Welcome to Rensa! 📸👋
      </h2>
      <p className="mt-2 text-base leading-6 text-gray-700">
        Thanks for signing up! Please verify your email to activate your Rensa
        account.
      </p>
      <a
        href={verificationLink}
        className="mt-5 inline-block rounded-lg bg-[#031602] px-6 py-3 text-sm font-semibold text-white no-underline"
      >
        Verify Email
      </a>
      <p className="mt-3 text-sm text-gray-500">
        This verification link will expire in 1 hour. If you did not create a
        Rensa account, you can ignore this email.
      </p>
      <hr className="my-6 border-t border-gray-200" />
      <p className="text-xs text-gray-500">
        Rensa 2025.
        <br />
        <a href="https://rensa.site" className="text-[#ff9000] no-underline">
          https://rensa.site
        </a>
      </p>
    </div>
  );
}

export default EmailVerificationTemplate;
