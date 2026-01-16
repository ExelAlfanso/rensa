import {
  Body,
  Container,
  Heading,
  Hr,
  Text,
  Link,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type ContactAdminEmailProps = {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  submittedAt?: string;
};

function MultilineText({ text }: { text: string }) {
  return (
    <>
      {text.split(/\r?\n/).map((line, index) => (
        <Text key={index} className="my-1 text-sm text-gray-700">
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
          <Heading className="mb-3 text-2xl font-semibold text-gray-900">
            New Contact Form Submission
          </Heading>

          <Text className="text-sm text-gray-800">
            <strong>From:</strong> {senderName}
          </Text>

          <Text className="text-sm text-gray-800">
            <strong>Email:</strong>{" "}
            <Link
              href={`mailto:${senderEmail}`}
              className="text-blue-600 no-underline"
            >
              {senderEmail}
            </Link>
          </Text>

          <Text className="text-sm text-gray-800">
            <strong>Subject:</strong> {subject}
          </Text>

          <Hr className="my-4 border-gray-200" />

          <Heading as="h3" className="text-lg font-semibold text-gray-900">
            Message
          </Heading>

          <MultilineText text={message} />

          <Hr className="my-4 border-gray-200" />

          <Text className="text-xs text-gray-500">
            Submitted at: {submittedAt}
          </Text>
        </Container>
      </Body>
    </Tailwind>
  );
}

export default ContactAdminEmail;
