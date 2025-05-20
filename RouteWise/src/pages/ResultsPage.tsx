import { useLocation, Link } from 'react-router-dom';
import { useFlightSearch } from '../hooks/useFlightSearch';
import type { FlightParams } from '../hooks/useFlightSearch'; 

export default function ResultsPage() {
  // Location state comes from HomePage navigate
  const { state } = useLocation() as { state: FlightParams };

  const { data, isLoading, error } = useFlightSearch(state);

  if (!state) {
    return (
      <div className="p-6">
        <p className="mb-4 text-red-500">No search parameters provided.</p>
        <Link to="/" className="text-blue-600 underline">
          Go back
        </Link>
      </div>
    );
  }

  if (isLoading) return <p className="p-6">Loading…</p>;
  if (error)     return <p className="p-6 text-red-500">Error loading flights.</p>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Results</h1>
      {data.length === 0 && <p>No flights found.</p>}

      <div className="space-y-4">
        {data.map((f) => (
          <div key={f.id} className="rounded border p-4 shadow">
            {f.summary}
          </div>
        ))}
      </div>

      <Link to="/" className="mt-6 inline-block text-blue-600 underline">
        New search
      </Link>
    </div>
  );
}
