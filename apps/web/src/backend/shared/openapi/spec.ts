import { authOpenApiFragment } from "@/app/api/auth/schema";
import { docsRouteFragment } from "@/app/api/docs/schema";
import { emailOpenApiFragment } from "@/app/api/email/schema";
import { notificationsReadOpenApiFragment } from "@/app/api/notifications/[id]/read/schema";
import { notificationsOpenApiFragment } from "@/app/api/notifications/schema";
import { openApiRouteFragment } from "@/app/api/openapi/schema";
import { photoByIdOpenApiFragment } from "@/app/api/photos/[id]/schema";
import { photoBookmarkOpenApiFragment } from "@/app/api/photos/bookmark/schema";
import { photosOpenApiFragment } from "@/app/api/photos/schema";
import { profileByIdOpenApiFragment } from "@/app/api/profile/[id]/schema";
import { rollByIdOpenApiFragment } from "@/app/api/rolls/[rollId]/schema";
import { rollsOpenApiFragment } from "@/app/api/rolls/schema";
import { usersByIdOpenApiFragment } from "@/app/api/users/[id]/schema";
import type { OpenApiFragment } from "./types";

const fragments: OpenApiFragment[] = [
	authOpenApiFragment,
	emailOpenApiFragment,
	photosOpenApiFragment,
	photoByIdOpenApiFragment,
	photoBookmarkOpenApiFragment,
	rollsOpenApiFragment,
	rollByIdOpenApiFragment,
	usersByIdOpenApiFragment,
	profileByIdOpenApiFragment,
	notificationsOpenApiFragment,
	notificationsReadOpenApiFragment,
	openApiRouteFragment,
	docsRouteFragment,
];

const collectTags = (items: OpenApiFragment[]): Array<{ name: string }> => {
	const tags = new Set<string>();
	for (const item of items) {
		for (const tag of item.tags ?? []) {
			tags.add(tag.name);
		}
	}
	return Array.from(tags).map((name) => ({ name }));
};

const mergePaths = (
	items: OpenApiFragment[]
): Record<string, Record<string, unknown>> => {
	const paths: Record<string, Record<string, unknown>> = {};
	for (const item of items) {
		for (const [path, methods] of Object.entries(item.paths ?? {})) {
			paths[path] = {
				...(paths[path] ?? {}),
				...methods,
			};
		}
	}
	return paths;
};

const mergeComponentGroup = (
	items: OpenApiFragment[],
	key: "schemas" | "examples"
): Record<string, unknown> => {
	const group: Record<string, unknown> = {};
	for (const item of items) {
		for (const [name, value] of Object.entries(item.components?.[key] ?? {})) {
			group[name] = value;
		}
	}
	return group;
};

export const openApiSpec = {
	openapi: "3.0.3",
	info: {
		title: "Rensa API",
		version: "1.1.0",
		description:
			"Canonical API contract for Rensa. Each route group owns docs in local schema.ts files with DTO and mock examples.",
	},
	servers: [
		{
			url: "/",
			description: "Current host",
		},
	],
	tags: collectTags(fragments),
	paths: mergePaths(fragments),
	components: {
		schemas: mergeComponentGroup(fragments, "schemas"),
		examples: mergeComponentGroup(fragments, "examples"),
	},
} as const;
