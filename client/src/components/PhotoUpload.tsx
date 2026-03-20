import { useRef, useState } from "react";
import { Photo } from "../types";
import { deletePhoto } from "../api/entries";
import ConfirmDialog from "./ConfirmDialog";

interface PhotoUploadProps {
  photos: Photo[];
  onUpload: (files: FileList) => void;
  onPhotoDeleted: (id: string) => void;
}

export default function PhotoUpload({
  photos,
  onUpload,
  onPhotoDeleted,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmPhotoId, setConfirmPhotoId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirmPhotoId) return;
    await deletePhoto(confirmPhotoId);
    onPhotoDeleted(confirmPhotoId);
    setConfirmPhotoId(null);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative">
            <img
              src={photo.url}
              alt="Entry photo"
              className="h-24 w-24 object-cover"
              style={{ border: "1px solid var(--border)" }}
            />
            <button
              type="button"
              aria-label="Delete photo"
              onClick={() => setConfirmPhotoId(photo.id)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-danger-600 text-xs text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files);
            e.target.value = "";
          }
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-xs font-medium uppercase tracking-wider transition-colors"
        style={{
          border: "1px dashed var(--border)",
          color: "var(--fg-muted)",
          padding: "0.5rem 1rem",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "var(--brand)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "var(--border)")
        }
      >
        + Add photos
      </button>
      <ConfirmDialog
        open={confirmPhotoId !== null}
        message="Delete this photo permanently?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmPhotoId(null)}
      />
    </div>
  );
}
