import { useRef, useState } from 'react';
import { Photo } from '../types';
import { deletePhoto } from '../api/entries';
import ConfirmDialog from './ConfirmDialog';

interface PhotoUploadProps {
  photos: Photo[];
  onUpload: (files: FileList) => void;
  onPhotoDeleted: (id: string) => void;
}

export default function PhotoUpload({ photos, onUpload, onPhotoDeleted }: PhotoUploadProps) {
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
      <div className="flex flex-wrap gap-3 mb-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.url}
              alt="Entry photo"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              aria-label="Delete photo"
              onClick={() => setConfirmPhotoId(photo.id)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
            e.target.value = '';
          }
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-sm border border-dashed border-gray-300 hover:border-green-500 text-gray-500 hover:text-green-700 px-4 py-2 rounded-lg"
      >
        + Add photos
      </button>

      <ConfirmDialog
        open={confirmPhotoId !== null}
        message="Delete this photo?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmPhotoId(null)}
      />
    </div>
  );
}
