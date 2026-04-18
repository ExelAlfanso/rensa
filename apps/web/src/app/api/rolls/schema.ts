import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const rollsOpenApiSchemaFragment: OpenApiFragment = {
	components: {
		schemas: {
			CreateRollDto: {
				type: "object",
				required: ["user_id", "name"],
				properties: {
					user_id: { type: "string", format: "uuid" },
					name: { type: "string", minLength: 1 },
					description: { type: "string" },
					imageUrl: { type: "string" },
				},
			},
		},
	},
};
