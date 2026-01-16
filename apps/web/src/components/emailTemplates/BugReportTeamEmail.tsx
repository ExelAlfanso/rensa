import {
  Body,
  Container,
  Heading,
  Hr,
  Text,
  Link,
  Tailwind,
} from "@react-email/components";

type BugReportTeamEmailProps = {
  title: string;
  email: string;
  description: string;
  severity: string;
  reportId: string;
  submittedAt: string;
  actualBehavior: string;
  expectedBehavior: string;
  stepsToReproduce: string;
};

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
        <Text key={index} className="my-1 text-sm text-gray-700">
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
          <Heading className="mb-2 text-2xl font-semibold text-gray-900">
            🐛 New Bug Report
          </Heading>

          <Text
            className="text-sm font-semibold"
            style={{ color: severityColor }}
          >
            Severity: {severity.toUpperCase()}
          </Text>

          <Text className="mt-2 text-sm text-gray-800">
            <strong>Title:</strong> {title}
          </Text>

          <Text className="text-sm text-gray-800">
            <strong>Reporter Email:</strong>{" "}
            <Link
              href={`mailto:${email}`}
              className="text-blue-600 no-underline"
            >
              {email}
            </Link>
          </Text>

          <Text className="text-sm font-mono text-gray-800">
            Report ID: {reportId}
          </Text>

          <Hr className="my-4 border-gray-200" />

          <Heading as="h3" className="text-lg font-semibold text-gray-900">
            Description
          </Heading>
          <MultilineText text={description} />

          <Heading as="h3" className="mt-4 text-lg font-semibold text-gray-900">
            Steps to Reproduce
          </Heading>
          <MultilineText text={stepsToReproduce} />

          <Heading as="h3" className="mt-4 text-lg font-semibold text-gray-900">
            Actual Behavior
          </Heading>
          <MultilineText text={actualBehavior} />

          <Heading as="h3" className="mt-4 text-lg font-semibold text-gray-900">
            Expected Behavior
          </Heading>
          <MultilineText text={expectedBehavior} />

          <Hr className="my-4 border-gray-200" />

          <Text className="text-xs text-gray-500">
            Submitted at: {submittedAt}
          </Text>
        </Container>
      </Body>
    </Tailwind>
  );
}

export default BugReportTeamEmail;
