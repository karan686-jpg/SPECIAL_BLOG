import React from "react";
import { UploadCloud } from "lucide-react";

/**
 * 🖼️ CoverImageUploader
 * Handles Notion-style blog cover image drag/click upload, preview with hover controls, and removal.
 */
export default function CoverImageUploader({
  image,
  onImageChange,
  onRemoveImage,
  fileInputRef,
}) {
  return (
    <div>
      {image ? (
        <div className="relative group/img w-full h-56 sm:h-72 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
          <img
            className="w-full h-full object-cover rounded-2xl"
            src={URL.createObjectURL(image)}
            alt="upload preview"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center gap-3 transition-opacity">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-lg shadow-md hover:bg-gray-100 transition cursor-pointer"
            >
              Change cover
            </button>
            <button
              type="button"
              onClick={onRemoveImage}
              className="px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-red-700 transition cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 rounded-2xl py-8 px-4 transition-all bg-gray-50/50 dark:bg-gray-900/30 flex flex-col items-center justify-center text-center group"
        >
          <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            + Add a thumbnail cover image
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Recommended 16:9 ratio WebP, PNG, or JPG
          </p>
        </div>
      )}
      <input
        onChange={onImageChange}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        id="image"
        hidden
        ref={fileInputRef}
      />
    </div>
  );
}
