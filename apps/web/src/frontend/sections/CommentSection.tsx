import { useEffect, useRef, useState } from "react";
import Comment from "@/frontend/components/Comment";
import Heading from "@/frontend/components/Heading";
import CommentInputField from "@/frontend/components/inputfields/CommentInputField";
import { api } from "@/lib/axios-client";

export interface CommentType {
	_id: string;
	createdAt: string;
	text: string;
	userId: {
		_id: string;
		username: string;
		avatarUrl?: string;
	};
}

interface CommentSectionProps {
	id?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ id }) => {
	const [comments, setComments] = useState<CommentType[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const bottomRef = useRef<HTMLDivElement>(null);

	// -------- Fetch Comments --------
	const fetchComments = async (photoId: string) => {
		setLoading(true);
		try {
			const res = await api.get(`/photos/${photoId}/comments?offset=0`);
			setComments(res.data.data.comments);
			setHasMore(res.data.data.hasMore);
		} catch (err) {
			console.error("Error fetching comments:", err);
		} finally {
			setLoading(false);
		}
	};

	// -------- Fetch More Comments --------
	const fetchMoreComments = async (photoId: string) => {
		if (!hasMore || loading) {
			return;
		}

		setLoading(true);
		try {
			const res = await api.get(
				`/photos/${photoId}/comments?offset=${comments.length}`
			);

			setComments((prev) => [...prev, ...res.data.data.comments]);
			setHasMore(res.data.data.hasMore);
		} catch (err) {
			console.error("Error fetching more comments:", err);
		} finally {
			setLoading(false);
		}
	};

	// -------- Reset & Fetch on Photo Change --------
	useEffect(() => {
		if (!id) {
			return;
		}
		setComments([]);
		fetchComments(id);
	}, [id, fetchComments]);

	// -------- Scroll to latest comment --------
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
	}, []);

	// -------- Add Comment (Optimistic UI) --------
	const handleAddComment = (newComment: CommentType) => {
		setComments((prev) => [...prev, newComment]);
	};

	return (
		<div>
			<Heading className="mb-5" size="m">
				Comments
			</Heading>

			<div className="no-scrollbar mb-5 max-h-90 overflow-y-auto">
				{comments.length > 0 ? (
					comments.map((comment, idx) => (
						<div className="relative" key={comment._id}>
							<Comment
								avatarUrl={comment.userId.avatarUrl}
								createdAt={comment.createdAt}
								disableBorder={idx === comments.length - 1}
								userId={comment.userId._id}
								username={comment.userId.username}
							>
								{comment.text}
							</Comment>
							{hasMore && idx === comments.length - 1 && (
								<div
									className="absolute bottom-0 left-0 flex h-5 w-full cursor-pointer items-center justify-center bg-gradient-to-t from-white/95 via-white/60 to-transparent backdrop-blur-[1px]"
									onClick={() => !loading && fetchMoreComments(id!)}
								>
									{loading ? (
										<div className="loading loading-spinner scale-75 text-primary" />
									) : (
										<span className="font-figtree text-primary text-xs">
											Load more
										</span>
									)}
								</div>
							)}
						</div>
					))
				) : loading ? (
					""
				) : (
					<p className="font-figtree text-black-200 text-xs">
						No comments yet. Be the first to comment!
					</p>
				)}

				<div ref={bottomRef} />
			</div>

			<CommentInputField id={id} onAddComment={handleAddComment} />
		</div>
	);
};

export default CommentSection;
