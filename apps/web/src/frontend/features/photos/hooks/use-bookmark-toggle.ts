"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/frontend/providers/ToastProvider";
import { fetchUserBookmarkedPhotos } from "@/frontend/services/photo.service";
import { bookmarkPhoto } from "@/frontend/services/photo-post.service";
import { useAuthStore } from "@/frontend/stores/useAuthStore";

interface UseBookmarkToggleParams {
	initialBookmarks?: number;
	photoId: string;
}

export function useBookmarkToggle({
	photoId,
	initialBookmarks = 0,
}: UseBookmarkToggleParams) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { showToast } = useToast();
	const { user } = useAuthStore();
	const [bookmarks, setBookmarks] = useState(initialBookmarks);
	const bookmarkQueryKey = ["isPhotoBookmarked", user?.id, photoId] as const;

	const { data: isBookmarked = false } = useQuery({
		queryKey: bookmarkQueryKey,
		queryFn: async () => {
			if (!user?.id) {
				return false;
			}
			const bookmarkedPhotos = await fetchUserBookmarkedPhotos(user.id);
			return bookmarkedPhotos.includes(photoId);
		},
		enabled: !!user?.id,
	});

	const toggleBookmarkMutation = useMutation({
		mutationFn: ({
			action,
		}: {
			action: "decrement" | "increment";
			nextBookmarked: boolean;
		}) => bookmarkPhoto(user?.id, photoId, action),
		onMutate: async ({ nextBookmarked }) => {
			await queryClient.cancelQueries({ queryKey: bookmarkQueryKey });
			const previousIsBookmarked =
				queryClient.getQueryData<boolean>(bookmarkQueryKey) ?? false;
			const previousBookmarks = bookmarks;

			queryClient.setQueryData<boolean>(bookmarkQueryKey, nextBookmarked);
			setBookmarks((prev) =>
				nextBookmarked ? prev + 1 : Math.max(prev - 1, 0)
			);

			return { previousBookmarks, previousIsBookmarked };
		},
		onError: (_error, _variables, context) => {
			if (context) {
				queryClient.setQueryData<boolean>(
					bookmarkQueryKey,
					context.previousIsBookmarked
				);
				setBookmarks(context.previousBookmarks);
			}
			showToast("Failed to update bookmark", "error");
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: bookmarkQueryKey });
		},
	});

	const handleToggle = () => {
		if (!user?.id) {
			router.push("/login");
			return;
		}

		const nextBookmarked = !isBookmarked;
		toggleBookmarkMutation.mutate({
			action: nextBookmarked ? "increment" : "decrement",
			nextBookmarked,
		});
	};

	return {
		bookmarks,
		handleToggle,
		isBookmarked,
	};
}

