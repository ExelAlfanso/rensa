"use client";

import { useFileUpload } from "@/frontend/hooks/useFileUpload";

export default function ProfilePage() {
  const {
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
  } = useFileUpload();

  return (
    <div className="min-h-screen bg-white-200 flex">
      <div
        onClick={handleBrowseClick}
        onDrop={(e) => handleDrop(e, 20)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center transition-all w-50 h-50 duration-300 rounded-full border-dashed cursor-pointer border-white-700 ${
          isDragOver ? "bg-white-600" : "hover:bg-white-600"
        } `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,.jpg,.jpeg"
          onChange={(e) => handleFileChange(e, 20)}
          className="hidden"
        />
        <div className="flex items-center justify-center">
          {isUploading && (
            <div className="mb-6 bg-gray-700 loading loading-spinner loading-xl"></div>
          )}
          {photo && !isUploading && (
            <img
              src={photo}
              alt="Uploaded"
              className="w-50 h-50 object-cover rounded-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
