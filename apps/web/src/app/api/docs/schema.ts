import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const docsRouteFragment: OpenApiFragment = {
	tags: [{ name: "docs" }],
	paths: {
		"/api/docs": {
			get: {
				tags: ["docs"],
				summary: "Redirect to Swagger UI (admin only)",
				responses: {
					307: { description: "Redirected to /swagger" },
					401: { description: "Unauthorized" },
					404: { description: "Not found" },
				},
			},
		},
	},
};
