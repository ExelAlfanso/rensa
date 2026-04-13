// components/auth/AuthFormLayout.tsx
import type { FormEventHandler, ReactNode } from "react";
import Logo from "@/frontend/components/icons/Logo";
import { sanitizeInput } from "@/lib/validation";

interface AuthFormLayoutProps {
	button: ReactNode; // Submit button (so you can pass your <Button />)
	children: ReactNode; // Inputs
	className?: string;
	error?: string;
	footer?: ReactNode; // Extra links (forgot password, etc.)
	message?: string;
	onSubmit: FormEventHandler<HTMLFormElement>;
	title: string;
}

export default function AuthFormLayout({
	title,
	onSubmit,
	className,
	error,
	message,
	children,
	button,
	footer,
}: AuthFormLayoutProps) {
	return (
		<div
			className={`flex w-[90%] flex-col items-center justify-center md:w-100 lg:w-112.5 xl:w-125 2xl:w-137.5 ${className}`}
		>
			<form className="mb-5 h-full w-full gap-16" onSubmit={onSubmit}>
				<div className="flex flex-col items-center justify-center">
					<Logo size={"lg"} />
					<h1 className="font-forum text-3xl text-black">{title}</h1>
				</div>

				<fieldset className="fieldset w-full p-4">
					{message && (
						<div className="mb-2 text-green-700 text-sm" role="status">
							{sanitizeInput(message)}
						</div>
					)}
					{error && (
						<div className="mb-2 text-orange-900 text-sm" role="alert">
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
