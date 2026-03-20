import { Link } from "react-router-dom";
import { Entry } from "../types";

interface EntryCardProps {
  entry: Entry;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function EntryCard({
  entry,
  onDelete,
  showActions = false,
}: EntryCardProps) {
  const firstPhoto = entry.photos?.[0];

  return (
    <article className="card-hover group overflow-hidden">
      {/* Photo */}
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        {firstPhoto ? (
          <img
            src={firstPhoto.url}
            alt={entry.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: "var(--bg-soft)" }}
          >
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--fg-subtle)" }}
            >
              No Image
            </span>
          </div>
        )}
        {/* Price badge */}
        <span
          className="absolute right-0 top-4 px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: "var(--fg)", color: "var(--bg)" }}
        >
          {entry.medianPrice}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <p
          className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--fg-muted)" }}
        >
          {entry.location}
        </p>
        <h3
          className="font-serif text-xl leading-snug"
          style={{ color: "var(--fg)" }}
        >
          {entry.name}
        </h3>
        <p
          className="mt-2 line-clamp-2 text-sm leading-relaxed"
          style={{ color: "var(--fg-muted)" }}
        >
          {entry.description}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <Link
            to={`/entries/${entry.id}`}
            className="group/lnk inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
            style={{ color: "var(--brand)" }}
          >
            Explore
            <span className="transition-transform group-hover/lnk:translate-x-0.5">
              →
            </span>
          </Link>
          {showActions && (
            <div className="ml-auto flex gap-2">
              <Link
                to={`/dashboard/edit/${entry.id}`}
                className="btn-secondary btn-sm"
              >
                Edit
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(entry.id)}
                  className="btn-danger btn-sm"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
