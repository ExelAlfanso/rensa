import type { OpenApiFragment } from "@/backend/shared/openapi/types";

export const photoBookmarkOpenApiFragment: OpenApiFragment = {
	tags: [{ name: "photos" }],
	paths: {
		"/api/photos/bookmark": {
			get: {
				tags: ["photos"],
				summary: "List bookmarked photos",
				parameters: [
					{
						in: "query",
						name: "userId",
						required: true,
						schema: { type: "string", format: "uuid" },
					},
					{ in: "query", name: "page", schema: { type: "integer" } },
					{ in: "query", name: "limit", schema: { type: "integer" } },
				],
				responses: { 200: { description: "Bookmarks listed" } },
			},
		},
		"/api/photos/bookmark/[id]": {
			post: {
				tags: ["photos"],
				summary: "Update bookmark",
				parameters: [
					{
						in: "path",
						name: "id",
						required: true,
						schema: { type: "string", format: "uuid" },
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/BookmarkActionDto" },
							example: {
								userId: "0f2d8f3e-1dd7-4a52-9dd7-8cbffa4fd89f",
								action: "increment",
							},
						},
					},
				},
				responses: { 200: { description: "Bookmark updated" } },
			},
		},
	},
	components: {
		schemas: {
			BookmarkActionDto: {
				type: "object",
				required: ["userId", "action"],
				properties: {
					userId: { type: "string", format: "uuid" },
					action: { type: "string", enum: ["increment", "decrement"] },
				},
			},
		},
	},
};
