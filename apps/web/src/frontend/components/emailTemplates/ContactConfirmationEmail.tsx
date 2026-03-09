import { Body, Container, Heading, Hr, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type ContactConfirmationEmailProps = {
  name: string;
  subject: string;
};

export function ContactConfirmationEmail({
  name,
  subject,
}: ContactConfirmationEmailProps) {
  return (
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-6">
          <Heading className="mb-3 text-2xl font-semibold text-gray-900">
            Thank you for contacting us!
          </Heading>

          <Text className="text-sm text-gray-800">Hi {name},</Text>

          <Text className="mt-2 text-sm text-gray-800">
            We have received your message regarding: <strong>{subject}</strong>
          </Text>

          <Text className="mt-2 text-sm text-gray-800">
            Our team will review your inquiry and get back to you as soon as
            possible.
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

export default ContactConfirmationEmail;
