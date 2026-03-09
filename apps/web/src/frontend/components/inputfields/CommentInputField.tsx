import React, { useState } from "react";
import InputField from "./InputField";
import { ChatTeardropIcon } from "@phosphor-icons/react";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import { CommentType } from "@/frontend/sections/CommentSection";
import { commentPhoto } from "@/services/PhotoPostServices";
import Link from "next/link";

interface CommentInputFieldProps {
  id?: string;
  onAddComment: (c: CommentType) => void;
}

const CommentInputField: React.FC<CommentInputFieldProps> = ({
  id,
  onAddComment,
}) => {
  const { user } = useAuthStore();
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    const tempId = Math.random().toString(36).substr(2, 9);

    const newComment: CommentType = {
      _id: tempId,
      text: comment,
      userId: {
        _id: user?.id || "unknown",
        username: user?.name || "Anonymous",
        avatarUrl: user?.image || "/profile.jpg",
      },
      createdAt: new Date().toISOString(),
    };

    onAddComment(newComment);
    setComment("");
    await commentPhoto(newComment, id || "", user?.id);
  };

  return (
    <div className="relative mt-4">
      <InputField
        type="text"
        size="m"
        disabled={!user}
        Icon={ChatTeardropIcon}
        iconPosition="left"
        placeholder={`  ${user ? "Comment" : "Log in to comment..."}`}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      {!user && (
        <Link
          href="/login"
          className="absolute bg-transparent hover:bg-gray-50 hover:opacity-50 transition-all duration-200 h-full w-full top-0 left-0 rounded-3xl"
        ></Link>
      )}
    </div>
  );
};

export default CommentInputField;
