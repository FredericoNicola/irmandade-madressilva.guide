import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEntry, createEntry, updateEntry, uploadPhotos } from '../api/entries';
import { Entry, Photo } from '../types';
import PhotoUpload from '../components/PhotoUpload';

export default function EntryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    medianPrice: '€',
    description: '',
  });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      getEntry(id).then((res) => {
        const e: Entry = res.data;
        setForm({
          name: e.name,
          location: e.location,
          latitude: e.latitude?.toString() ?? '',
          longitude: e.longitude?.toString() ?? '',
          medianPrice: e.medianPrice,
          description: e.description,
        });
        setPhotos(e.photos);
      });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let entry: Entry;
      if (isEditing && id) {
        const res = await updateEntry(id, form);
        entry = res.data;
      } else {
        const res = await createEntry(form);
        entry = res.data;
      }

      if (pendingFiles && pendingFiles.length > 0) {
        await uploadPhotos(entry.id, pendingFiles);
      }

      navigate('/dashboard');
    } catch {
      setError('Failed to save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Entry' : 'New Entry'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder="e.g. Cervejaria Ramiro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className={inputClass}
            placeholder="e.g. Intendente, Lisboa"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className={inputClass}
              placeholder="38.7169"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className={inputClass}
              placeholder="-9.1395"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Median Price *</label>
          <select
            value={form.medianPrice}
            onChange={(e) => setForm({ ...form, medianPrice: e.target.value })}
            className={inputClass}
          >
            <option value="€">€ — Budget (under €15)</option>
            <option value="€€">€€ — Mid-range (€15–30)</option>
            <option value="€€€">€€€ — Upscale (€30+)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inputClass}
            placeholder="Describe this spot…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
          {isEditing ? (
            <PhotoUpload
              photos={photos}
              onUpload={(files) => setPendingFiles(files)}
              onPhotoDeleted={(photoId) =>
                setPhotos((prev) => prev.filter((p) => p.id !== photoId))
              }
            />
          ) : (
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPendingFiles(e.target.files)}
              className="text-sm text-gray-500"
            />
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold px-6 py-2 rounded-lg text-sm"
          >
            {loading ? 'Saving…' : isEditing ? 'Update Entry' : 'Create Entry'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
