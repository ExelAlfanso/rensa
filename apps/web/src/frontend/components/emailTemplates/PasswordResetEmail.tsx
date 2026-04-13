import {
	Body,
	Button,
	Container,
	Heading,
	Hr,
	Link,
	Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface PasswordResetEmailProps {
	resetLink: string;
}

export function PasswordResetEmail({ resetLink }: PasswordResetEmailProps) {
	return (
		<Tailwind>
			<Body className="bg-[#f7f8f5] font-sans">
				<Container className="mx-auto max-w-xl rounded-xl border border-[#e1e5dc] bg-white p-6">
					{/* Brand */}
					<Text className="font-bold text-[#ff9000] text-sm uppercase tracking-wide">
						Rensa
					</Text>

					<Heading className="mt-3 font-semibold text-2xl text-[#0f1b0f] leading-tight">
						Reset your password
					</Heading>

					<Text className="mt-2 text-[#2c352c] text-sm leading-6">
						We received a request to reset the password for your Rensa account.
					</Text>

					{/* CTA */}
					<Button
						className="mt-4 inline-block rounded-lg bg-[#031602] px-4 py-3 font-semibold text-sm text-white"
						href={resetLink}
					>
						Reset password
					</Button>

					<Text className="mt-2 text-[#4c554c] text-sm">
						This link is valid for 60 minutes.
					</Text>

					<Text className="mt-3 text-[#4c554c] text-sm">
						If you did not request this, you can safely ignore this email.
					</Text>

					<Hr className="my-6 border-[#e1e5dc]" />

					<Text className="text-gray-500 text-xs">Rensa © 2025</Text>

					<Link
						className="text-[#ff9000] text-xs no-underline"
						href="https://rensa.site"
					>
						https://rensa.site
					</Link>
				</Container>
			</Body>
		</Tailwind>
	);
}

export default PasswordResetEmail;
