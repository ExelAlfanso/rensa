import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const openApiRouteFragment: OpenApiFragment = {
	tags: [{ name: "docs" }],
	paths: {
		"/api/openapi": {
			get: {
				tags: ["docs"],
				summary: "OpenAPI JSON",
				responses: { 200: { description: "OpenAPI document" } },
			},
		},
	},
};
