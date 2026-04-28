import { Body, Tailwind, Text } from "@react-email/components";

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
