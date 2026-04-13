import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const authOpenApiFragment: OpenApiFragment = {
	tags: [{ name: "auth" }],
	paths: {
		"/api/auth/[...nextauth]": {
			get: { tags: ["auth"], summary: "NextAuth handler" },
			post: { tags: ["auth"], summary: "NextAuth handler" },
		},
		"/api/auth/login": {
			post: {
				tags: ["auth"],
				summary: "Login",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/UserLoginDto" },
							example: { email: "user@rensa.site", password: "Secret123!" },
						},
					},
				},
				responses: {
					200: {
						description: "Login success",
						content: {
							"application/json": {
								example: {
									success: true,
									user: {
										id: "0f2d8f3e-1dd7-4a52-9dd7-8cbffa4fd89f",
										name: "rensa-user",
										email: "user@rensa.site",
									},
								},
							},
						},
					},
					400: { description: "Bad request" },
					401: { description: "Unauthorized" },
					429: { description: "Rate limited" },
				},
			},
		},
		"/api/auth/register": {
			post: {
				tags: ["auth"],
				summary: "Register",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/UserRegisterRequestDto" },
							example: {
								username: "new-user",
								email: "new@rensa.site",
								password: "Secret123!",
								confirmPassword: "Secret123!",
							},
						},
					},
				},
				responses: {
					201: { description: "Registered" },
					400: { description: "Validation error" },
					409: { description: "Conflict" },
					429: { description: "Rate limited" },
				},
			},
		},
		"/api/auth/logout": {
			post: {
				tags: ["auth"],
				summary: "Logout",
				responses: { 200: { description: "Logout success" } },
			},
		},
		"/api/auth/reset-password": {
			post: {
				tags: ["auth"],
				summary: "Reset password",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/ResetPasswordDto" },
							example: {
								token: "jwt-token",
								password: "NewSecret123!",
								confirmPassword: "NewSecret123!",
							},
						},
					},
				},
				responses: {
					200: { description: "Password reset success" },
					400: { description: "Invalid token or payload" },
					404: { description: "User not found" },
				},
			},
		},
		"/api/auth/verify-email": {
			post: {
				tags: ["auth"],
				summary: "Verify email token",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/VerifyEmailDto" },
							example: { token: "jwt-token" },
						},
					},
				},
				responses: { 200: { description: "Verified or already verified" } },
			},
		},
	},
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
