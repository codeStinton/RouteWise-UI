import { useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { useFlightSearch } from "../hooks/useFlightSearch";
import type { FlightParams } from "../hooks/useFlightSearch";

export default function ResultsPage() {
  const { state } = useLocation() as { state: FlightParams | null };
  const { data, isLoading, error } = state
    ? useFlightSearch(state)
    : { data: null, isLoading: false, error: null };

  return (
    <Layout
      hero={
        <Header>
          <p className="text-lg font-medium text-white">Search results</p>
        </Header>
      }
    >
      {!state && (
        <div className="p-6">
          <p className="mb-4 text-red-500">No search parameters provided.</p>
          <Link to="/" className="text-blue-600 underline">
            Go back
          </Link>
        </div>
      )}

      {isLoading && <p className="p-6">Loading…</p>}
      {error && <p className="p-6 text-red-500">Error loading flights.</p>}

      {data && (
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
      )}
    </Layout>
  );
}
