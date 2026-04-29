import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const authOpenApiSchemaFragment: OpenApiFragment = {
	components: {
		schemas: {
			UserLoginDto: {
				type: "object",
				required: ["email", "password"],
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string", minLength: 1 },
				},
			},
			UserRegisterRequestDto: {
				type: "object",
				required: ["username", "email", "password", "confirmPassword"],
				properties: {
					username: { type: "string", minLength: 1 },
					email: { type: "string", format: "email" },
					password: { type: "string", minLength: 8 },
					confirmPassword: { type: "string", minLength: 8 },
				},
			},
			ResetPasswordDto: {
				type: "object",
				required: ["token", "password", "confirmPassword"],
				properties: {
					token: { type: "string" },
					password: { type: "string", minLength: 8 },
					confirmPassword: { type: "string", minLength: 8 },
				},
			},
			VerifyEmailDto: {
				type: "object",
				required: ["token"],
				properties: { token: { type: "string" } },
			},
		},
	},
};
