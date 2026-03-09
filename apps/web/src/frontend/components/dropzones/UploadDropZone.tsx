import { PanoramaIcon } from "@phosphor-icons/react";
import React from "react";

interface UploadDropZoneProps {
  handleBrowseClick: () => void;
  handleDrop: (
    event: React.DragEvent<HTMLDivElement>,
    sizeLimit: number,
  ) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  isDragOver: boolean;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    size: number,
  ) => void;
  content?: React.ReactNode;
}

const UploadDropZone: React.FC<UploadDropZoneProps> = ({
  handleBrowseClick,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  isDragOver,
  isUploading,
  fileInputRef,
  handleFileChange,
  content,
}) => {
  return (
    <div
      onClick={handleBrowseClick}
      onDrop={(e) => handleDrop(e, 20)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex flex-col items-center justify-center max-w-2xl mx-auto my-20 transition-all duration-300 border-2 border-dashed cursor-pointer px-10 md:px-15 lg:px-28 border-white-700 ${
        isDragOver ? "bg-white-600" : "hover:bg-white-600"
      } rounded-3xl h-96`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,.jpg,.jpeg"
        onChange={(e) => handleFileChange(e, 20)}
        className="hidden"
      />
      <div className="flex items-center justify-center">
        {isUploading ? (
          <div className="mb-6 bg-gray-700 loading loading-spinner loading-xl"></div>
        ) : (
          <PanoramaIcon size={240} weight={"thin"}></PanoramaIcon>
        )}
      </div>
      <div className="flex flex-col items-center justify-center">{content}</div>
    </div>
  );
};

export default UploadDropZone;
