import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const emailOpenApiFragment: OpenApiFragment = {
	tags: [{ name: "email" }],
	paths: {
		"/api/email/send-verification": {
			post: {
				tags: ["email"],
				summary: "Send verification email",
				requestBody: {
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/EmailOnlyDto" },
							example: { email: "user@rensa.site" },
						},
					},
				},
				responses: { 200: { description: "Email sent" } },
			},
		},
		"/api/email/forgot-password": {
			post: {
				tags: ["email"],
				summary: "Send password reset email",
				requestBody: {
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/EmailOnlyDto" },
							example: { email: "user@rensa.site" },
						},
					},
				},
				responses: { 200: { description: "Generic success response" } },
			},
		},
		"/api/email/contact": {
			post: {
				tags: ["email"],
				summary: "Submit contact form",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/CreateContactDto" },
							example: {
								name: "Rensa User",
								email: "user@rensa.site",
								subject: "Question",
								message: "Need help with photo upload.",
							},
						},
					},
				},
				responses: { 201: { description: "Contact submitted" } },
			},
			get: {
				tags: ["email"],
				summary: "List contacts (admin)",
				responses: { 200: { description: "Contacts listed" } },
			},
		},
		"/api/email/bug-reports": {
			post: {
				tags: ["email"],
				summary: "Submit bug report",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/CreateBugReportDto" },
							example: {
								title: "Upload button broken",
								email: "user@rensa.site",
								description: "The button does not respond.",
								stepsToReproduce: "Open upload page and click upload.",
								expectedBehavior: "File picker should open.",
								actualBehavior: "Nothing happens.",
							},
						},
					},
				},
				responses: { 201: { description: "Bug report submitted" } },
			},
			get: {
				tags: ["email"],
				summary: "List bug reports (admin)",
				responses: { 200: { description: "Bug reports listed" } },
			},
		},
	},
	components: {
		schemas: {
			EmailOnlyDto: {
				type: "object",
				required: ["email"],
				properties: { email: { type: "string", format: "email" } },
			},
			CreateContactDto: {
				type: "object",
				required: ["name", "email", "subject", "message"],
				properties: {
					name: { type: "string", minLength: 2, maxLength: 100 },
					email: { type: "string", format: "email" },
					subject: { type: "string", minLength: 5, maxLength: 200 },
					message: { type: "string", minLength: 10, maxLength: 5000 },
				},
			},
			CreateBugReportDto: {
				type: "object",
				required: [
					"title",
					"email",
					"description",
					"expectedBehavior",
					"actualBehavior",
				],
				properties: {
					title: { type: "string" },
					email: { type: "string", format: "email" },
					description: { type: "string" },
					stepsToReproduce: { type: "string" },
					expectedBehavior: { type: "string" },
					actualBehavior: { type: "string" },
				},
			},
		},
	},
};
