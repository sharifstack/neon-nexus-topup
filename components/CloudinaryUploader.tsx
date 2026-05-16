"use client";

/**
 * CloudinaryUploader
 * A reusable drop-zone image upload component that sends files to /api/admin/upload.
 * Usage:
 *   <CloudinaryUploader
 *     folder="neon-nexus-banners"
 *     value={imageUrl}
 *     onChange={(url) => setImageUrl(url)}
 *     label="Banner Image"
 *     aspectRatio="wide"   // "wide" | "square" | "auto"
 *   />
 */

import { useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Upload, Loader2, X, ImageIcon } from "lucide-react";

interface Props {
  folder: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "wide" | "square" | "auto";
  maxSizeMB?: number;
  disabled?: boolean;
}

export default function CloudinaryUploader({
  folder,
  value,
  onChange,
  label = "Image",
  aspectRatio = "square",
  maxSizeMB = 10,
  disabled = false,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const heightClass = aspectRatio === "wide" ? "h-40" : aspectRatio === "square" ? "h-40 max-w-[160px]" : "h-32";

  const uploadFile = useCallback(async (file: File) => {
    // Validate
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid type. Use JPEG, PNG, WebP, GIF, or SVG.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Max ${maxSizeMB}MB.`);
      return;
    }

    // Optimistic preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setIsUploading(true);
    const tid = `cloud-upload-${Date.now()}`;
    toast.loading(`Uploading ${label}...`, { id: tid });

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setPreview(data.url);
      onChange(data.url);
      toast.success(`${label} uploaded!`, { id: tid });
    } catch (err: any) {
      toast.error(err.message || "Upload failed", { id: tid });
      // Revert on failure
      setPreview(value || "");
    } finally {
      setIsUploading(false);
    }
  }, [folder, label, maxSizeMB, onChange, value]);

  const handleFile = (file: File | undefined) => {
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) handleFile(e.dataTransfer.files[0]);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview("");
    onChange("");
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-bold text-white/50 uppercase tracking-wider">{label}</label>
      )}

      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={`
          relative ${heightClass} rounded-xl border-2 border-dashed overflow-hidden cursor-pointer
          transition-all duration-200
          ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-white/10 hover:border-primary/50 hover:bg-white/5"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            {/* Overlay on hover */}
            {!disabled && !isUploading && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-white text-xs font-bold">
                  <Upload className="w-4 h-4" /> Replace
                </div>
              </div>
            )}
            {/* Clear button */}
            {!disabled && !isUploading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/30">
            <ImageIcon className="w-8 h-8" />
            <p className="text-xs font-bold uppercase">Drag & drop or click</p>
            <p className="text-[10px]">Max {maxSizeMB}MB</p>
          </div>
        )}

        {/* Upload Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-primary font-bold uppercase">Uploading...</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
        disabled={disabled || isUploading}
      />
    </div>
  );
}
