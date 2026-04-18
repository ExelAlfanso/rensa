import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const notificationsReadOpenApiFragment: OpenApiFragment = {
	tags: [{ name: "notifications" }],
	paths: {
		"/api/notifications/[id]/read": {
			put: {
				tags: ["notifications"],
				summary: "Mark notification as read",
				parameters: [
					{
						in: "path",
						name: "id",
						required: true,
						schema: { type: "string", format: "uuid" },
					},
				],
				responses: { 200: { description: "Marked as read" } },
			},
			delete: {
				tags: ["notifications"],
				summary: "Clear notifications by user",
				parameters: [
					{
						in: "path",
						name: "id",
						required: true,
						schema: { type: "string", format: "uuid" },
					},
				],
				responses: { 200: { description: "Notifications cleared" } },
			},
		},
	},
};
