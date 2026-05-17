import { NextResponse } from "next/server";
import type { Photo } from "@/frontend/types/photo";

interface PicsumPhoto {
	author: string;
	downloadUrl: string;
	height: number;
	id: string;
	url: string;
	width: number;
}

const toPhoto = (photo: PicsumPhoto): Photo => ({
	bookmarks: 0,
	createdAt: undefined,
	description: `Photo by ${photo.author}`,
	metadata: {
		height: photo.height,
		width: photo.width,
		format: "jpg",
	},
	photoId: photo.id,
	title: `Picsum #${photo.id}`,
	url: photo.downloadUrl,
	user: {
		userId: photo.author.toLowerCase().replaceAll(" ", "-"),
		username: photo.author,
	},
});

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = Number(searchParams.get("page") ?? "1");
		const perPage = Number(searchParams.get("limit") ?? "10");
		const sort = searchParams.get("sort") === "popular" ? "popular" : "recent";

		const response = await fetch(
			`https://picsum.photos/v2/list?page=${page}&limit=${perPage}`,
			{
				next: { revalidate: 60 },
			}
		);

		if (!response.ok) {
			const message = await response.text();
			return NextResponse.json(
				{ error: `Picsum request failed: ${message}` },
				{ status: response.status }
			);
		}

		const payload = (await response.json()) as PicsumPhoto[];
		const sortedPayload = sort === "popular" ? [...payload].reverse() : payload;
		const photos = sortedPayload.map(toPhoto);

		return NextResponse.json({
			photos,
			hasMore: payload.length === perPage,
		});
	} catch (error) {
		return NextResponse.json(
			{
				error: "Failed to fetch Picsum photos",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
