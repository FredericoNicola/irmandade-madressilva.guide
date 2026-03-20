import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEntries, deleteEntry } from '../api/entries';
import { Entry } from '../types';
import EntryCard from '../components/EntryCard';
import ConfirmDialog from '../components/ConfirmDialog';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/dashboard/new"
          className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          + New Entry
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">🍽️</p>
          <p>No entries yet. Add your first spot!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              showActions
              onDelete={(id) => setConfirmId(id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        message="Are you sure you want to delete this entry? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
