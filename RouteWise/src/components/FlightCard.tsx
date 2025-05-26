interface FlightCardProps {
  airline: string;
  departTime: string;
  arriveTime: string;
  departCode: string;
  arriveCode: string;
  duration: string;
  stops: string;
  price: string;
}

export default function FlightCard({
  airline,
  departTime,
  arriveTime,
  departCode,
  arriveCode,
  duration,
  stops,
  price,
}: FlightCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl border p-4 shadow-sm hover:shadow-md transition">
      {/* Left: flight info */}
      <div className="flex-1 space-y-2 text-center sm:text-left">
        <p className="text-sm font-semibold text-gray-500">{airline}</p>
        <div className="flex items-center justify-center sm:justify-start gap-3 text-lg font-medium">
          <span>{departTime}</span>
          <span className="text-gray-400">→</span>
          <span>{arriveTime}</span>
        </div>
        <div className="text-sm text-gray-500">
          {departCode} → {arriveCode}
        </div>
        <div className="text-sm text-gray-500">
          {duration} · {stops}
        </div>
      </div>

      {/* Right: price + button */}
      <div className="flex flex-col items-center sm:items-end gap-2">
        <p className="text-xl font-bold text-gray-800">{price}</p>
        <button className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Select →
        </button>
      </div>
    </div>
  );
}
