import {
	Body,
	Container,
	Heading,
	Hr,
	Link,
	Tailwind,
	Text,
} from "@react-email/components";

interface BugReportTeamEmailProps {
	actualBehavior: string;
	description: string;
	email: string;
	expectedBehavior: string;
	reportId: string;
	severity: string;
	stepsToReproduce: string;
	submittedAt: string;
	title: string;
}

const severityColorMap: Record<string, string> = {
	critical: "#dc2626",
	high: "#ea580c",
	medium: "#ca8a04",
	low: "#16a34a",
};

function MultilineText({ text }: { text: string }) {
	return (
		<>
			{text.split(/\r?\n/).map((line, index) => (
				<Text className="my-1 text-gray-700 text-sm" key={index}>
					{line || "\u00A0"}
				</Text>
			))}
		</>
	);
}

export function BugReportTeamEmail({
	title,
	email,
	description,
	severity,
	reportId,
	submittedAt,
	actualBehavior,
	expectedBehavior,
	stepsToReproduce,
}: BugReportTeamEmailProps) {
	const severityColor = severityColorMap[severity.toLowerCase()] ?? "#374151";

	return (
		<Tailwind>
			<Body className="bg-gray-50 font-sans">
				<Container className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
					<Heading className="mb-2 font-semibold text-2xl text-gray-900">
						🐛 New Bug Report
					</Heading>

					<Text
						className="font-semibold text-sm"
						style={{ color: severityColor }}
					>
						Severity: {severity.toUpperCase()}
					</Text>

					<Text className="mt-2 text-gray-800 text-sm">
						<strong>Title:</strong> {title}
					</Text>

					<Text className="text-gray-800 text-sm">
						<strong>Reporter Email:</strong>{" "}
						<Link
							className="text-blue-600 no-underline"
							href={`mailto:${email}`}
						>
							{email}
						</Link>
					</Text>

					<Text className="font-mono text-gray-800 text-sm">
						Report ID: {reportId}
					</Text>

					<Hr className="my-4 border-gray-200" />

					<Heading as="h3" className="font-semibold text-gray-900 text-lg">
						Description
					</Heading>
					<MultilineText text={description} />

					<Heading as="h3" className="mt-4 font-semibold text-gray-900 text-lg">
						Steps to Reproduce
					</Heading>
					<MultilineText text={stepsToReproduce} />

					<Heading as="h3" className="mt-4 font-semibold text-gray-900 text-lg">
						Actual Behavior
					</Heading>
					<MultilineText text={actualBehavior} />

					<Heading as="h3" className="mt-4 font-semibold text-gray-900 text-lg">
						Expected Behavior
					</Heading>
					<MultilineText text={expectedBehavior} />

					<Hr className="my-4 border-gray-200" />

					<Text className="text-gray-500 text-xs">
						Submitted at: {submittedAt}
					</Text>
				</Container>
			</Body>
		</Tailwind>
	);
}

export default BugReportTeamEmail;
