import { Link } from 'react-router-dom';
import { Entry } from '../types';

interface EntryCardProps {
  entry: Entry;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function EntryCard({ entry, onDelete, showActions = false }: EntryCardProps) {
  const firstPhoto = entry.photos?.[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {firstPhoto ? (
        <img
          src={firstPhoto.url}
          alt={entry.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">
          🍽️
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{entry.name}</h3>
          <span className="text-green-700 font-bold text-sm shrink-0 ml-2">{entry.medianPrice}</span>
        </div>
        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <span>📍</span> {entry.location}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">{entry.description}</p>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/entries/${entry.id}`}
            className="text-sm text-green-700 hover:text-green-800 font-medium"
          >
            View details →
          </Link>
          {showActions && (
            <div className="ml-auto flex gap-2">
              <Link
                to={`/dashboard/edit/${entry.id}`}
                className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-md font-medium"
              >
                Edit
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(entry.id)}
                  className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded-md font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
