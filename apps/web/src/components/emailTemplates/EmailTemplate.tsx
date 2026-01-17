import {
  Body,
  Container,
  Heading,
  Hr,
  Text,
  Tailwind,
} from "@react-email/components";

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <Tailwind>
      <Body>
        <Text>Hello {firstName},</Text>
      </Body>
    </Tailwind>
  );
}
export default EmailTemplate;
