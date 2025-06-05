import { useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Filter,
  Plane,
  MapPin,
  Star,
  ArrowRight,
  Users,
  Calendar,
  CalendarDays,
  Clock,
  DollarSign,
} from "lucide-react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import FlightCard from "../components/FlightCard";
import { useFlightSearch } from "../hooks/useFlightSearch";
import type { FlightParams } from "../hooks/useFlightSearch";

function formatDate(date: string | undefined) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

interface FilterState {
  priceRange: [number, number];
  stops: string[];
  airlines: string[];
  departureTime: string[];
}

export default function ResultsPage() {
  const { state } = useLocation() as { state: FlightParams | null };
  const { data, isLoading, error } = state
    ? useFlightSearch(state)
    : { data: null, isLoading: false, error: null };

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000],
    stops: [],
    airlines: [],
    departureTime: [],
  });

  const [sortBy, setSortBy] = useState("price");

  // Extract unique airlines from data
  const availableAirlines = useMemo(() => {
    if (!data) return [];
    const airlines = new Set(data.map((flight) => flight.airline));
    return Array.from(airlines).filter(Boolean);
  }, [data]);

  // Filter and sort flights
  const filteredAndSortedFlights = useMemo(() => {
    if (!data) return [];

    let filtered = [...data];

    // Apply price filter
    filtered = filtered.filter(
      (flight) => flight.price <= filters.priceRange[1]
    );

    // Apply stops filter
    if (filters.stops.length > 0) {
      filtered = filtered.filter((flight) => {
        if (filters.stops.includes("Direct") && flight.stops === "Direct")
          return true;
        if (filters.stops.includes("1 stop") && flight.stops === "1 stop")
          return true;
        if (
          filters.stops.includes("2+ stops") &&
          (flight.stops.includes("2") ||
            flight.stops.includes("3") ||
            flight.stops.includes("+"))
        )
          return true;
        return false;
      });
    }

    // Apply airline filter
    if (filters.airlines.length > 0) {
      filtered = filtered.filter((flight) =>
        filters.airlines.includes(flight.airline)
      );
    }

    // Apply departure time filter
    if (filters.departureTime.length > 0) {
      filtered = filtered.filter((flight) => {
        const hour = parseInt(flight.departTime.split(":")[0]);

        if (
          filters.departureTime.includes("Early Morning") &&
          hour >= 6 &&
          hour < 12
        )
          return true;
        if (
          filters.departureTime.includes("Afternoon") &&
          hour >= 12 &&
          hour < 18
        )
          return true;
        if (
          filters.departureTime.includes("Evening") &&
          hour >= 18 &&
          hour < 24
        )
          return true;
        if (filters.departureTime.includes("Night") && hour >= 0 && hour < 6)
          return true;

        return false;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "duration":
          // Parse duration (e.g., "2h 30m" -> 150 minutes)
          const getDurationMinutes = (duration: string) => {
            const match = duration.match(/(\d+)h\s*(\d+)m/);
            if (match) {
              return parseInt(match[1]) * 60 + parseInt(match[2]);
            }
            return 0;
          };
          return (
            getDurationMinutes(a.duration) - getDurationMinutes(b.duration)
          );
        case "departure":
          return a.departTime.localeCompare(b.departTime);
        case "stops":
          const getStopsCount = (stops: string) => {
            if (stops === "Direct") return 0;
            if (stops === "1 stop") return 1;
            return 2;
          };
          return getStopsCount(a.stops) - getStopsCount(b.stops);
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, filters, sortBy]);

  const handleFilterChange = (type: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Format search summary based on search type
  const getSearchSummary = () => {
    if (!state) return null;

    const elements = [];

    // Route
    elements.push(
      <div
        key="route"
        className="flex items-center gap-2.5 bg-gradient-to-r from-blue-500/80 to-blue-600/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-lg hover:shadow-xl transition-all"
      >
        <div className="bg-white/20 rounded-full p-1">
          <Plane className="w-4 h-4" />
        </div>
        <span className="font-semibold text-sm">{state.from}</span>
        <ArrowRight className="w-4 h-4 opacity-70" />
        <span className="font-semibold text-sm">{state.to}</span>
      </div>
    );

    // Travelers
    elements.push(
      <div
        key="travelers"
        className="flex items-center gap-2.5 bg-gradient-to-r from-blue-500/80 to-blue-600/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-lg hover:shadow-xl transition-all"
      >
        <div className="bg-white/20 rounded-full p-1">
          <Users className="w-4 h-4" />
        </div>
        <span className="font-medium text-sm">
          {state.travellers} {state.travellers === 1 ? "Adult" : "Adults"}
        </span>
      </div>
    );

    // Date information based on search type
    switch (state.dateSearchType) {
      case "specific":
        if (state.departDate) {
          elements.push(
            <div
              key="dates"
              className="flex items-center gap-2.5 bg-gradient-to-r from-blue-500/80 to-blue-600/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="bg-white/20 rounded-full p-1">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">
                {formatDate(state.departDate)}
              </span>
              {state.returnDate && (
                <>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                  <span className="font-medium text-sm">
                    {formatDate(state.returnDate)}
                  </span>
                </>
              )}
            </div>
          );
        }
        break;

      case "flexible-month":
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        elements.push(
          <div
            key="flexible-month"
            className="flex items-center gap-2.5 bg-gradient-to-r from-purple-500/80 to-purple-600/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-white/20 rounded-full p-1">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">
              {state.month ? monthNames[state.month - 1] : ""} {state.year}
            </span>
          </div>
        );
        break;

      case "flexible-days":
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        elements.push(
          <div
            key="flexible-days"
            className="flex items-center gap-2.5 bg-gradient-to-r from-green-500/80 to-green-600/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-white/20 rounded-full p-1">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">
              {state.departureDayOfWeek !== undefined
                ? dayNames[state.departureDayOfWeek]
                : ""}
              {state.returnDayOfWeek !== undefined
                ? ` → ${dayNames[state.returnDayOfWeek]}`
                : ""}
            </span>
          </div>
        );
        break;

      case "duration":
        elements.push(
          <div
            key="duration"
            className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500/80 to-amber-600/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-white/20 rounded-full p-1">
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">
              {state.durationDays} days from{" "}
              {formatDate(state.earliestDeparture)}
            </span>
          </div>
        );
        break;
    }

    // Add max price if set
    if (state.maxPrice) {
      elements.push(
        <div
          key="price"
          className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-500/80 to-emerald-600/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-lg hover:shadow-xl transition-all"
        >
          <div className="bg-white/20 rounded-full p-1">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm">Max £{state.maxPrice}</span>
        </div>
      );
    }

    return elements;
  };

  // Calculate max price from data for slider
  const maxPriceInData = useMemo(() => {
    if (!data || data.length === 0) return 2000;
    return Math.ceil(Math.max(...data.map((f) => f.price)) / 100) * 100;
  }, [data]);

  return (
    <Layout
      hero={
        <Header>
          {state && (
            <>
              <div className="absolute top-4 left-6 p-5">
                <Link
                  to="/"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <Plane className="text-white" size={28} />
                  </div>
                  <h1 className="text-xl font-bold text-white">RouteWise</h1>
                </Link>
              </div>

              <div className="relative z-10 text-center space-y-4 pt-24">
                {/* Search Parameters */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-white">
                  {getSearchSummary()}
                </div>
                <div className="pt-4">
                  <div className="mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              </div>
            </>
          )}
        </Header>
      }
    >
      {!state && (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Search Parameters
          </h2>
          <p className="text-gray-600 mb-6">
            Please start a new search to find flights.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plane className="w-4 h-4" />
            New Search
          </Link>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
            <p className="text-gray-600">Finding the best flights for you...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Search Error
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the flight results. Please try again.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      )}

      {data && (
        <div className="max-w-7xl mx-auto p-6">
          {/* Results Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {filteredAndSortedFlights.length} Flight
                {filteredAndSortedFlights.length !== 1 ? "s" : ""} Found
              </h1>
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">
                  Best deals available
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="duration">Duration</option>
                  <option value="departure">Departure Time</option>
                  <option value="stops">Fewest Stops</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-6 space-y-6">
                {/* Enhanced Filter Panel */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-lg text-gray-900">
                        Filters
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Price Range */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        💰 Price Range
                      </h4>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="2000"
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            handleFilterChange("priceRange", [
                              0,
                              parseInt(e.target.value),
                            ])
                          }
                          className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-600">£0</span>
                          <span className="text-blue-600">
                            £{filters.priceRange[1]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stops */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        ✈️ Stops
                      </h4>
                      <div className="space-y-3">
                        {["Direct", "1 stop", "2+ stops"].map((stop) => (
                          <label
                            key={stop}
                            className="flex items-center group cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={filters.stops.includes(stop)}
                              onChange={(e) => {
                                const newStops = e.target.checked
                                  ? [...filters.stops, stop]
                                  : filters.stops.filter((s) => s !== stop);
                                handleFilterChange("stops", newStops);
                              }}
                            />
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                              {stop}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Airlines */}
                    {availableAirlines.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          🏢 Airlines
                        </h4>
                        <div className="space-y-3">
                          {availableAirlines.map((airline) => (
                            <label
                              key={airline}
                              className="flex items-center group cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={filters.airlines.includes(airline)}
                                onChange={(e) => {
                                  const newAirlines = e.target.checked
                                    ? [...filters.airlines, airline]
                                    : filters.airlines.filter(
                                        (a) => a !== airline
                                      );
                                  handleFilterChange("airlines", newAirlines);
                                }}
                              />
                              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                                {airline}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Departure Time */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        🕐 Departure Time
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            label: "Early Morning",
                            time: "6AM - 12PM",
                            icon: "🌅",
                          },
                          {
                            label: "Afternoon",
                            time: "12PM - 6PM",
                            icon: "☀️",
                          },
                          { label: "Evening", time: "6PM - 12AM", icon: "🌆" },
                          { label: "Night", time: "12AM - 6AM", icon: "🌙" },
                        ].map((period) => (
                          <button
                            key={period.label}
                            onClick={() => {
                              const newTimes = filters.departureTime.includes(
                                period.label
                              )
                                ? filters.departureTime.filter(
                                    (t) => t !== period.label
                                  )
                                : [...filters.departureTime, period.label];
                              handleFilterChange("departureTime", newTimes);
                            }}
                            className={`p-3 border-2 rounded-lg text-xs transition-all ${
                              filters.departureTime.includes(period.label)
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="text-lg mb-1">{period.icon}</div>
                            <div className="font-medium">{period.label}</div>
                            <div className="text-gray-500">{period.time}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex gap-6">
                {/* Flight Results */}
                <div className="flex-1 space-y-4">
                  {filteredAndSortedFlights.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plane className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Flights Match Your Filters
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Try adjusting your filters to see more results.
                      </p>
                      <button
                        onClick={() =>
                          setFilters({
                            priceRange: [0, maxPriceInData],
                            stops: [],
                            airlines: [],
                            departureTime: [],
                          })
                        }
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Filter className="w-4 h-4" />
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <>
                      {filteredAndSortedFlights.map((f) => (
                        <div
                          key={f.id}
                          className="transform transition-all duration-200 hover:scale-[1.02]"
                        >
                          <FlightCard
                            airline={f.airline || "Unknown Airline"}
                            departTime={f.departTime}
                            arriveTime={f.arriveTime}
                            departCode={f.departCode}
                            arriveCode={f.arriveCode}
                            duration={f.duration}
                            stops={f.stops}
                            price={`£${f.price}`}
                          />
                        </div>
                      ))}

                      <div className="mt-8 text-center">
                        <Link
                          to="/"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                          <Plane className="w-5 h-5" />
                          Start New Search
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Trip Summary Panel */}
                <div className="w-80 flex-shrink-0 hidden xl:block">
                  <div className="sticky top-6 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          ✈️ Travel Inspiration
                        </h3>
                      </div>
                      <div className="relative">
                        <video
                          className="w-full h-auto"
                          autoPlay
                          muted
                          loop
                          playsInline
                          poster="/assets/video-poster.jpg"
                        >
                          <source src="/assets/video.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-4 left-4 right-4"></div>
                      </div>
                    </div>
                    {/* Trip Summary */}
                    {state && (
                      <div className="bg-white via-indigo-50 to-purple-50 rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                            ✈️ Trip Summary
                          </h3>
                        </div>

                        <div className="p-6 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Route:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {state.from} → {state.to}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600 flex items-center gap-2">
                                👥 Travelers:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {state.travellers} Adult
                                {state.travellers > 1 ? "s" : ""}
                              </span>
                            </div>

                            {/* Date info based on search type */}
                            {state.dateSearchType === "specific" &&
                              state.departDate && (
                                <>
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 flex items-center gap-2">
                                      📅 Departure:
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      {formatDate(state.departDate)}
                                    </span>
                                  </div>
                                  {state.returnDate && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <span className="text-gray-600 flex items-center gap-2">
                                        🔄 Return:
                                      </span>
                                      <span className="font-semibold text-gray-900">
                                        {formatDate(state.returnDate)}
                                      </span>
                                    </div>
                                  )}
                                </>
                              )}

                            {state.dateSearchType === "flexible-month" && (
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 flex items-center gap-2">
                                  📅 Month:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {state.month}/{state.year}
                                </span>
                              </div>
                            )}

                            {state.dateSearchType === "flexible-days" && (
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 flex items-center gap-2">
                                  📅 Days:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  Flexible
                                </span>
                              </div>
                            )}

                            {state.dateSearchType === "duration" && (
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 flex items-center gap-2">
                                  ⏱️ Duration:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {state.durationDays} days
                                </span>
                              </div>
                            )}

                            {state.maxStops !== undefined && (
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 flex items-center gap-2">
                                  🛬 Max Stops:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {state.maxStops === 0
                                    ? "Non-stop"
                                    : `${state.maxStops} stop${
                                        state.maxStops > 1 ? "s" : ""
                                      }`}
                                </span>
                              </div>
                            )}

                            {state.maxPrice && (
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 flex items-center gap-2">
                                  💷 Budget:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  £{state.maxPrice}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-blue-200 pt-4">
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-green-200">
                              <span className="text-gray-600 flex items-center gap-2">
                                ✅ Results:
                              </span>
                              <span className="font-bold text-green-600">
                                {filteredAndSortedFlights.length} /{" "}
                                {data.length} flights
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
