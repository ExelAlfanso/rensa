import { Body, Container, Heading, Hr, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface ContactConfirmationEmailProps {
	name: string;
	subject: string;
}

export function ContactConfirmationEmail({
	name,
	subject,
}: ContactConfirmationEmailProps) {
	return (
		<Tailwind>
			<Body className="bg-gray-50 font-sans">
				<Container className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-6">
					<Heading className="mb-3 font-semibold text-2xl text-gray-900">
						Thank you for contacting us!
					</Heading>

					<Text className="text-gray-800 text-sm">Hi {name},</Text>

					<Text className="mt-2 text-gray-800 text-sm">
						We have received your message regarding: <strong>{subject}</strong>
					</Text>

					<Text className="mt-2 text-gray-800 text-sm">
						Our team will review your inquiry and get back to you as soon as
						possible.
					</Text>

					<Hr className="my-4 border-gray-200" />

					<Text className="text-gray-500 text-xs">
						This is an automated response. Please do not reply to this email.
					</Text>
				</Container>
			</Body>
		</Tailwind>
	);
}

export default ContactConfirmationEmail;
