import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const docsOpenApiSchemaFragment: OpenApiFragment = {
	components: {
		schemas: {
			ApiMessageResponse: {
				type: "object",
				required: ["message"],
				properties: {
					message: { type: "string" },
				},
			},
		},
	},
};

