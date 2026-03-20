import { useEffect, useState } from 'react';
import { getEntries } from '../api/entries';
import { Entry } from '../types';
import EntryCard from '../components/EntryCard';

export default function PublicListing() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getEntries()
      .then((res) => setEntries(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🌸 Irmandade Madressilva Guide
        </h1>
        <p className="text-gray-500 text-lg">Our favourite spots around Lisbon</p>
      </div>

      <div className="mb-8 max-w-md mx-auto">
        <input
          type="search"
          placeholder="Search by name, location, or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">🍽️</p>
          <p>No spots found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
