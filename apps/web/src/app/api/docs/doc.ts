import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const docsRouteFragment: OpenApiFragment = {
	tags: [{ name: "docs" }],
	paths: {
		"/api/docs": {
			get: {
				tags: ["docs"],
				summary: "Swagger UI documentation page",
				responses: {
					200: {
						description: "Swagger UI page rendered",
					},
				},
			},
		},
	},
};
