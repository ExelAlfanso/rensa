import {
	Body,
	Container,
	Heading,
	Hr,
	Link,
	Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface ContactAdminEmailProps {
	message: string;
	senderEmail: string;
	senderName: string;
	subject: string;
	submittedAt?: string;
}

function MultilineText({ text }: { text: string }) {
	return (
		<>
			{text.split(/\r?\n/).map((line, index) => (
				<Text className="my-1 text-gray-700 text-sm" key={index}>
					{line}
				</Text>
			))}
		</>
	);
}

export function ContactAdminEmail({
	senderName,
	senderEmail,
	subject,
	message,
	submittedAt = new Date().toISOString(),
}: ContactAdminEmailProps) {
	return (
		<Tailwind>
			<Body className="bg-gray-50 font-sans">
				<Container className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
					<Heading className="mb-3 font-semibold text-2xl text-gray-900">
						New Contact Form Submission
					</Heading>

					<Text className="text-gray-800 text-sm">
						<strong>From:</strong> {senderName}
					</Text>

					<Text className="text-gray-800 text-sm">
						<strong>Email:</strong>{" "}
						<Link
							className="text-blue-600 no-underline"
							href={`mailto:${senderEmail}`}
						>
							{senderEmail}
						</Link>
					</Text>

					<Text className="text-gray-800 text-sm">
						<strong>Subject:</strong> {subject}
					</Text>

					<Hr className="my-4 border-gray-200" />

					<Heading as="h3" className="font-semibold text-gray-900 text-lg">
						Message
					</Heading>

					<MultilineText text={message} />

					<Hr className="my-4 border-gray-200" />

					<Text className="text-gray-500 text-xs">
						Submitted at: {submittedAt}
					</Text>
				</Container>
			</Body>
		</Tailwind>
	);
}

export default ContactAdminEmail;
