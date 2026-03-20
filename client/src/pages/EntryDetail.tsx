import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEntry, deleteEntry } from '../api/entries';
import { Entry } from '../types';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';

export default function EntryDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getEntry(id)
        .then((res) => setEntry(res.data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = async () => {
    if (!entry) return;
    await deleteEntry(entry.id);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">Loading…</span>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">Entry not found.</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-green-700 hover:text-green-800 mb-6 block">
        ← Back to listings
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {entry.photos.length > 0 && (
          <div>
            <img
              src={entry.photos[0].url}
              alt={entry.name}
              className="w-full h-72 object-cover cursor-pointer"
              onClick={() => setSelectedPhoto(entry.photos[0].url)}
            />
            {entry.photos.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {entry.photos.slice(1).map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg shrink-0 cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedPhoto(photo.url)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{entry.name}</h1>
              <p className="text-gray-500 text-sm mt-1">📍 {entry.location}</p>
            </div>
            <span className="text-green-700 font-bold text-xl">{entry.medianPrice}</span>
          </div>

          <p className="text-gray-700 leading-relaxed">{entry.description}</p>

          {entry.latitude && entry.longitude && (
            <p className="text-xs text-gray-400 mt-4">
              {entry.latitude}, {entry.longitude}
            </p>
          )}

          {entry.createdBy && (
            <p className="text-xs text-gray-400 mt-2">Added by {entry.createdBy.name}</p>
          )}

          {user && (
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <Link
                to={`/dashboard/edit/${entry.id}`}
                className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium"
              >
                Edit
              </Link>
              <button
                onClick={() => setConfirmOpen(true)}
                className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this entry? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
