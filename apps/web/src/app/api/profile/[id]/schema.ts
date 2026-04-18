import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const profileByIdOpenApiFragment: OpenApiFragment = {
	tags: [{ name: "profile" }],
	paths: {
		"/api/profile/[id]": {
			get: {
				tags: ["profile"],
				summary: "Get profile by id",
				parameters: [
					{
						in: "path",
						name: "id",
						required: true,
						schema: { type: "string", format: "uuid" },
					},
				],
				responses: { 200: { description: "Profile found" } },
			},
			post: {
				tags: ["profile"],
				summary: "Update profile",
				parameters: [
					{
						in: "path",
						name: "id",
						required: true,
						schema: { type: "string", format: "uuid" },
					},
				],
				requestBody: {
					content: {
						"multipart/form-data": {
							schema: { $ref: "#/components/schemas/UpdateProfileDto" },
						},
						"application/json": {
							schema: { $ref: "#/components/schemas/UpdateProfileDto" },
							example: {
								id: "0f2d8f3e-1dd7-4a52-9dd7-8cbffa4fd89f",
								username: "updated-user",
								email: "updated@rensa.site",
							},
						},
					},
				},
				responses: { 200: { description: "Profile updated" } },
			},
		},
	},
	components: {
		schemas: {
			UpdateProfileDto: {
				type: "object",
				required: ["id", "username", "email"],
				properties: {
					id: { type: "string", format: "uuid" },
					username: { type: "string" },
					email: { type: "string", format: "email" },
					avatar: { type: "string", format: "binary" },
				},
			},
		},
	},
};
