"use client";

import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

interface BookmarkButtonProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  id,
  className,
  children,
}) => {
  return (
    <Link
    href={"/bookmarks"}
      id={id}
      className={`cursor-pointer hover:text-gray-800 transition-colors duration-300 ${className}`}
    >
      <BookmarkSimpleIcon size={32} weight="fill"></BookmarkSimpleIcon>
      {children}
    </Link>
  );
};

export default BookmarkButton;
