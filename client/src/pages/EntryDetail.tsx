import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEntry, deleteEntry } from "../api/entries";
import { Entry } from "../types";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

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
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--fg-subtle)" }}
        >
          Loading…
        </p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-serif text-2xl" style={{ color: "var(--fg-muted)" }}>
          Entry not found
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors"
        style={{ color: "var(--fg-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
      >
        ← Back
      </Link>

      {/* Hero photo */}
      {entry.photos.length > 0 && (
        <div className="mb-8">
          <div
            className="overflow-hidden cursor-pointer"
            style={{ height: "480px" }}
            onClick={() => setSelectedPhoto(entry.photos[0].url)}
          >
            <img
              src={entry.photos[0].url}
              alt={entry.name}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          {entry.photos.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {entry.photos.slice(1).map((photo) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt=""
                  className="h-20 w-20 shrink-0 cursor-pointer object-cover transition-opacity hover:opacity-75"
                  onClick={() => setSelectedPhoto(photo.url)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div style={{ borderBottom: "1px solid var(--border)" }} className="pb-8">
        <div className="flex items-start justify-between">
          <div>
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--fg-muted)" }}
            >
              {entry.location}
            </p>
            <h1
              className="font-serif text-5xl leading-tight"
              style={{ color: "var(--fg)" }}
            >
              {entry.name}
            </h1>
          </div>
          <span
            className="mt-2 shrink-0 px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: "var(--fg)", color: "var(--bg)" }}
          >
            {entry.medianPrice}
          </span>
        </div>
      </div>

      <div className="py-8">
        <p
          className="text-base leading-[1.8]"
          style={{ color: "var(--fg-muted)" }}
        >
          {entry.description}
        </p>

        {entry.latitude && entry.longitude && (
          <p
            className="mt-6 text-xs font-mono"
            style={{ color: "var(--fg-subtle)" }}
          >
            {entry.latitude}°, {entry.longitude}°
          </p>
        )}
        {entry.createdBy && (
          <p className="mt-1 text-xs" style={{ color: "var(--fg-subtle)" }}>
            Added by {entry.createdBy.name}
          </p>
        )}
      </div>

      {user && (
        <div
          className="flex gap-3 pt-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <Link
            to={`/dashboard/edit/${entry.id}`}
            className="btn-secondary btn-md"
          >
            Edit entry
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            className="btn-danger btn-md"
          >
            Delete
          </button>
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Full size"
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        message="Delete this entry permanently? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
