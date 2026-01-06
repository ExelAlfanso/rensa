// components/auth/AuthFormLayout.tsx
import { ReactNode, FormEventHandler } from "react";
import Logo from "@/components/icons/Logo";
import { sanitizeInput } from "@/lib/validation";

type AuthFormLayoutProps = {
  title: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  error?: string;
  message?: string;
  children: ReactNode; // Inputs
  button: ReactNode; // Submit button (so you can pass your <Button />)
  footer?: ReactNode; // Extra links (forgot password, etc.)
};

export default function AuthFormLayout({
  title,
  onSubmit,
  error,
  message,
  children,
  button,
  footer,
}: AuthFormLayoutProps) {
  return (
    <div className="w-[90%] md:w-[400px] lg:w-[450px] xl:w-[500px] 2xl:w-[550px] flex flex-col items-center justify-center">
      <form onSubmit={onSubmit} className="w-full h-full gap-16 mb-5">
        <div className="flex flex-col items-center justify-center">
          <Logo size={"lg"} />
          <h1 className="font-forum text-3xl text-black">{title}</h1>
        </div>

        <fieldset className="w-full p-4 fieldset">
          {message && (
            <div className="text-green-700 text-sm mb-2" role="status">
              {sanitizeInput(message)}
            </div>
          )}
          {error && (
            <div className="text-orange-900 text-sm mb-2" role="alert">
              {sanitizeInput(error)}
            </div>
          )}
          <div className="flex flex-col gap-4">{children}</div>
          {button}
        </fieldset>
      </form>

      {footer && (
        <div className="flex flex-col items-center justify-center gap-5">
          {footer}
        </div>
      )}
    </div>
  );
}
