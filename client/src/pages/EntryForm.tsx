import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEntry,
  createEntry,
  updateEntry,
  uploadPhotos,
} from "../api/entries";
import { Entry, Photo } from "../types";
import PhotoUpload from "../components/PhotoUpload";

export default function EntryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    medianPrice: "€",
    description: "",
  });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      getEntry(id).then((res) => {
        const e: Entry = res.data;
        setForm({
          name: e.name,
          location: e.location,
          latitude: e.latitude?.toString() ?? "",
          longitude: e.longitude?.toString() ?? "",
          medianPrice: e.medianPrice,
          description: e.description,
        });
        setPhotos(e.photos);
      });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
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
      if (pendingFiles.length > 0) {
        await uploadPhotos(entry.id, pendingFiles);
      }
      navigate("/dashboard");
    } catch {
      setError("Failed to save entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 lg:px-10">
      <div
        className="mb-10 pb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <p
          className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--fg-muted)" }}
        >
          {isEditing ? "Editing" : "New Entry"}
        </p>
        <h1 className="font-serif text-4xl" style={{ color: "var(--fg)" }}>
          {isEditing ? form.name || "Edit Entry" : "Add a spot"}
        </h1>
      </div>

      {error && (
        <div className="mb-6 border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:border-danger-800 dark:bg-danger-900/20 dark:text-danger-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            placeholder="e.g. Cervejaria Ramiro"
          />
        </div>

        <div>
          <label className="label">Location *</label>
          <input
            type="text"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="input"
            placeholder="e.g. Intendente, Lisboa"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Latitude</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className="input"
              placeholder="38.7169"
            />
          </div>
          <div>
            <label className="label">Longitude</label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className="input"
              placeholder="-9.1395"
            />
          </div>
        </div>

        <div>
          <label className="label">Price Range *</label>
          <select
            value={form.medianPrice}
            onChange={(e) => setForm({ ...form, medianPrice: e.target.value })}
            className="input"
          >
            <option value="€">€ — Budget (under €15)</option>
            <option value="€€">€€ — Mid-range (€15–30)</option>
            <option value="€€€">€€€ — Upscale (€30+)</option>
          </select>
        </div>

        <div>
          <label className="label">Description *</label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input"
            placeholder="What makes this place worth coming back to?"
          />
        </div>

        <div>
          <label className="label">Photos</label>
          {isEditing ? (
            <PhotoUpload
              photos={photos}
              entryId={id}
              onPhotosAdded={(newPhotos) =>
                setPhotos((prev) => [...prev, ...newPhotos])
              }
              onPhotoDeleted={(photoId) =>
                setPhotos((prev) => prev.filter((p) => p.id !== photoId))
              }
            />
          ) : (
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setPendingFiles(
                  e.target.files ? Array.from(e.target.files) : [],
                )
              }
              className="text-sm"
              style={{ color: "var(--fg-muted)" }}
            />
          )}
        </div>

        <div
          className="flex flex-col gap-3 pt-4 sm:flex-row"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-md w-full sm:w-auto"
          >
            {loading ? "Saving…" : isEditing ? "Update Entry" : "Create Entry"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="btn-secondary btn-md w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
