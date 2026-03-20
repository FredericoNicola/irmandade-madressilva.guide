import { useEffect, useState } from "react";
import { getEntries } from "../api/entries";
import { Entry } from "../types";
import EntryCard from "../components/EntryCard";

export default function PublicListing() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getEntries()
      .then((res) => setEntries(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Hero */}
      <section
        className="py-24 text-center"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-4xl px-6">
          <p
            className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--fg-muted)" }}
          >
            Lisbon — Since Always
          </p>
          <h1
            className="font-serif leading-[0.9] tracking-tight"
            style={{
              color: "var(--fg)",
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
            }}
          >
            Irmandade
            <br />
            <span className="italic" style={{ color: "var(--brand)" }}>
              Madressilva
            </span>
          </h1>
          <p
            className="mx-auto mt-8 max-w-lg text-base leading-relaxed"
            style={{ color: "var(--fg-muted)" }}
          >
            A curated collection of the places we return to — the restaurants,
            bars, and hidden corners that define our Lisbon.
          </p>
        </div>
      </section>

      {/* Search + Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        {/* Search */}
        <div className="mb-12 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "var(--fg-subtle)" }}
            >
              ⌕
            </span>
            <input
              type="search"
              placeholder="Search by name, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--fg-subtle)" }}
          >
            {filtered.length} place{filtered.length !== 1 ? "s" : ""}
          </span>
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
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p
              className="font-serif text-3xl"
              style={{ color: "var(--fg-muted)" }}
            >
              No spots found
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--fg-subtle)" }}>
              Try a different search term
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3"
            style={{ backgroundColor: "var(--border)" }}
          >
            {filtered.map((entry) => (
              <div key={entry.id} style={{ backgroundColor: "var(--bg)" }}>
                <EntryCard entry={entry} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
