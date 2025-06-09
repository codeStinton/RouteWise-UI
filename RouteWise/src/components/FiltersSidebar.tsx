import { Filter } from "lucide-react";
import type { FilterState } from "../types/flight.types";
import { TIME_PERIODS } from "../constants/dates";

interface FiltersSidebarProps {
  filters: FilterState;
  onFilterChange: (type: keyof FilterState, value: any) => void;
  availableAirlines: string[];
  maxPrice: number;
}

export default function FiltersSidebar({
  filters,
  onFilterChange,
  availableAirlines,
  maxPrice,
}: FiltersSidebarProps) {
  return (
    <div className="w-80 flex-shrink-0">
      <div className="sticky top-6 space-y-6">
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
                  max={maxPrice}
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    onFilterChange("priceRange", [
                      0,
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer"
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
                        onFilterChange("stops", newStops);
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
                            : filters.airlines.filter((a) => a !== airline);
                          onFilterChange("airlines", newAirlines);
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
                {TIME_PERIODS.map((period) => (
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
                      onFilterChange("departureTime", newTimes);
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
  );
}
