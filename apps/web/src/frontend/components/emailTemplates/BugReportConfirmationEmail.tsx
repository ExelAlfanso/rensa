import {
	Body,
	CodeInline,
	Container,
	Heading,
	Hr,
	Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface BugReportConfirmationEmailProps {
	reportId: string;
	title: string;
}

export function BugReportConfirmationEmail({
	title,
	reportId,
}: BugReportConfirmationEmailProps) {
	return (
		<Tailwind>
			<Body className="bg-gray-50 font-sans">
				<Container className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-6">
					<Heading className="mb-3 font-semibold text-2xl text-gray-900">
						Bug Report Received
					</Heading>

					<Text className="text-gray-800 text-sm">
						Thank you for reporting this issue!
					</Text>

					<Text className="mt-2 text-gray-800 text-sm">
						<strong>Report Title:</strong> {title}
					</Text>

					<Text className="mt-1 text-gray-800 text-sm">
						<strong>Report ID:</strong>{" "}
						<CodeInline className="rounded bg-gray-100 px-1 py-0.5 text-xs">
							{reportId}
						</CodeInline>
					</Text>

					<Text className="mt-2 text-gray-800 text-sm">
						Our development team is looking into this. We will update you on the
						status of your report.
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

export default BugReportConfirmationEmail;
