import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import Layout from '../components/Layout';
import FlightCard from '../components/FlightCard';
import { useFlightSearch } from '../hooks/useFlightSearch';
import type { FlightParams } from '../hooks/useFlightSearch';

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export default function ResultsPage() {
  const { state } = useLocation() as { state: FlightParams | null };
  const { data, isLoading, error } = state
    ? useFlightSearch(state)
    : { data: null, isLoading: false, error: null };

  return (
    <Layout
      hero={
        <Header>
          {state && (
            <p className="text-lg font-medium text-white text-center">
              {state.from} – {state.to} · {state.travellers}{' '}
              {state.travellers === 1 ? 'Adult' : 'Adults'}{' '}
              {formatDate(state.departDate)} · {formatDate(state.returnDate)}
            </p>
          )}
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
        <div className="mx-auto max-w-3xl p-6 space-y-4">
          {data.length === 0 && <p>No flights found.</p>}
          {data.map((f) => (
            <FlightCard
              key={f.id}
              airline={f.airline || 'Unknown Airline'}
              departTime={f.departTime}
              arriveTime={f.arriveTime}
              departCode={f.departCode}
              arriveCode={f.arriveCode}
              duration={f.duration}
              stops={f.stops}
              price={`£${f.price}`}
            />
          ))}
          <Link to="/" className="mt-6 inline-block text-blue-600 underline">
            New search
          </Link>
        </div>
      )}
    </Layout>
  );
}