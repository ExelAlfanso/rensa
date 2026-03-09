import {
  Body,
  Container,
  Heading,
  Hr,
  Text,
  CodeInline,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type BugReportConfirmationEmailProps = {
  title: string;
  reportId: string;
};

export function BugReportConfirmationEmail({
  title,
  reportId,
}: BugReportConfirmationEmailProps) {
  return (
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-6">
          <Heading className="mb-3 text-2xl font-semibold text-gray-900">
            Bug Report Received
          </Heading>

          <Text className="text-sm text-gray-800">
            Thank you for reporting this issue!
          </Text>

          <Text className="mt-2 text-sm text-gray-800">
            <strong>Report Title:</strong> {title}
          </Text>

          <Text className="mt-1 text-sm text-gray-800">
            <strong>Report ID:</strong>{" "}
            <CodeInline className="rounded bg-gray-100 px-1 py-0.5 text-xs">
              {reportId}
            </CodeInline>
          </Text>

          <Text className="mt-2 text-sm text-gray-800">
            Our development team is looking into this. We will update you on the
            status of your report.
          </Text>

          <Hr className="my-4 border-gray-200" />

          <Text className="text-xs text-gray-500">
            This is an automated response. Please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  );
}

export default BugReportConfirmationEmail;
