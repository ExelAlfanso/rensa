"use client";
import { useState, useCallback, useRef } from "react";

export function useFileUpload() {
  const [photo, setPhoto] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelect = useCallback((file: File, sizeLimit: number) => {
    const isJPG =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.name.toLowerCase().endsWith(".jpg") ||
      file.name.toLowerCase().endsWith(".jpeg");
    const isLtSize = file.size / 1024 / 1024 < sizeLimit; // size in MB
    if (!isLtSize) {
      setMessage(`Image must be smaller than ${sizeLimit}MB!`);
      return;
    }
    if (!isJPG) {
      setMessage("Only JPG/JPEG files are allowed.");
      return;
    }
    // setUploadedFile(null);
    setUploadedFile(file);
    setMessage("");
    setIsUploading(true);

    const previewFile = URL.createObjectURL(file);
    setPhoto(previewFile);

    setTimeout(() => {
      setIsUploading(false);
      // console.log("File selected:", file.name);
    }, 800);
    // console.log("Selected file:", uploadedFile);
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent, sizeLimit: number) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;

      if (files && files.length > 0) {
        handleFileSelect(files[0], sizeLimit);
      }
    },
    [handleFileSelect],
  );
  //TODO: handle file change from input type file, can be photo, profile, document, etc.
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    size: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file, size);
    }
  };

  const handleCancel = () => {
    setMessage("");
    setUploadedFile(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    photo,
    uploadedFile,
    isUploading,
    isDragOver,
    message,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleBrowseClick,
    handleDrop,
    handleFileChange,
    handleCancel,
  };
}
