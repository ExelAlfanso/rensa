import {
  Body,
  Container,
  Heading,
  Hr,
  Text,
  Button,
  Link,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type PasswordResetEmailProps = {
  resetLink: string;
};

export function PasswordResetEmail({ resetLink }: PasswordResetEmailProps) {
  return (
    <Tailwind>
      <Body className="bg-[#f7f8f5] font-sans">
        <Container className="mx-auto max-w-xl rounded-xl border border-[#e1e5dc] bg-white p-6">
          {/* Brand */}
          <Text className="text-sm font-bold uppercase tracking-wide text-[#ff9000]">
            Rensa
          </Text>

          <Heading className="mt-3 text-2xl font-semibold leading-tight text-[#0f1b0f]">
            Reset your password
          </Heading>

          <Text className="mt-2 text-sm leading-6 text-[#2c352c]">
            We received a request to reset the password for your Rensa account.
          </Text>

          {/* CTA */}
          <Button
            href={resetLink}
            className="mt-4 inline-block rounded-lg bg-[#031602] px-4 py-3 text-sm font-semibold text-white"
          >
            Reset password
          </Button>

          <Text className="mt-2 text-sm text-[#4c554c]">
            This link is valid for 60 minutes.
          </Text>

          <Text className="mt-3 text-sm text-[#4c554c]">
            If you did not request this, you can safely ignore this email.
          </Text>

          <Hr className="my-6 border-[#e1e5dc]" />

          <Text className="text-xs text-gray-500">Rensa © 2025</Text>

          <Link
            href="https://rensa.site"
            className="text-xs text-[#ff9000] no-underline"
          >
            https://rensa.site
          </Link>
        </Container>
      </Body>
    </Tailwind>
  );
}

export default PasswordResetEmail;
