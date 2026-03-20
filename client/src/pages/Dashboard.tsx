import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEntries, deleteEntry } from "../api/entries";
import { Entry } from "../types";
import EntryCard from "../components/EntryCard";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    getEntries()
      .then((res) => setEntries(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!confirmId) return;
    await deleteEntry(confirmId);
    setEntries((prev) => prev.filter((e) => e.id !== confirmId));
    setConfirmId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div
        className="mb-10 flex items-end justify-between pb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <p
            className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--fg-muted)" }}
          >
            Management
          </p>
          <h1 className="font-serif text-4xl" style={{ color: "var(--fg)" }}>
            Your Entries
          </h1>
        </div>
        <Link to="/dashboard/new" className="btn-primary btn-md">
          + New Entry
        </Link>
      </div>

      {loading ? (
        <div className="py-32 text-center">
          <p
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--fg-subtle)" }}
          >
            Loading…
          </p>
        </div>
      ) : entries.length === 0 ? (
        <div className="py-32 text-center">
          <p
            className="font-serif text-3xl"
            style={{ color: "var(--fg-muted)" }}
          >
            No entries yet
          </p>
          <p className="mt-2 text-sm" style={{ color: "var(--fg-subtle)" }}>
            Add your first spot to get started
          </p>
          <Link
            to="/dashboard/new"
            className="btn-primary btn-md mt-8 inline-flex"
          >
            Add first entry
          </Link>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3"
          style={{ backgroundColor: "var(--border)" }}
        >
          {entries.map((entry) => (
            <div key={entry.id} style={{ backgroundColor: "var(--bg)" }}>
              <EntryCard
                entry={entry}
                showActions
                onDelete={(id) => setConfirmId(id)}
              />
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        message="Delete this entry permanently? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
