import { useState } from "react";
import {
  Plus,
  X,
  Calendar,
  Clock,
  MapPin,
  Plane,
  DollarSign,
} from "lucide-react";
import ReactDatePicker, { type DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { SearchFormData } from "../types/search.types";
import { DAYS_OF_WEEK, MONTHS } from "../constants/dates"; // adjust the path

const DatePicker = ReactDatePicker as unknown as React.FC<DatePickerProps>;

interface AdvancedOptionsProps {
  show: boolean;
  onToggle: () => void;
  tripType: string;
  onTripTypeChange: (type: "one-way" | "roundtrip" | "multi-city") => void;
  searchParams: SearchFormData;
  onSearchParamsChange: (params: SearchFormData) => void;
}

export default function AdvancedOptions({
  show,
  tripType,
  onTripTypeChange,
  searchParams,
  onSearchParamsChange,
}: AdvancedOptionsProps) {
  const [newLayoverCity, setNewLayoverCity] = useState("");


  const handleFieldChange = (field: keyof SearchFormData, value: any) => {
    onSearchParamsChange({
      ...searchParams,
      [field]: value,
    });
  };

  const addMultiCityLeg = () => {
    const currentLegs = searchParams.multiCityLegs || [];
    const newId = Math.max(...currentLegs.map((leg) => leg.id), 0) + 1;
    handleFieldChange("multiCityLegs", [
      ...currentLegs,
      { id: newId, from: "", to: "", date: "" },
    ]);
  };

  const removeMultiCityLeg = (id: number) => {
    const currentLegs = searchParams.multiCityLegs || [];
    if (currentLegs.length > 2) {
      handleFieldChange(
        "multiCityLegs",
        currentLegs.filter((leg) => leg.id !== id)
      );
    }
  };

  const updateMultiCityLeg = (
    id: number,
    field: "from" | "to" | "date",
    value: string
  ) => {
    const currentLegs = searchParams.multiCityLegs || [];
    handleFieldChange(
      "multiCityLegs",
      currentLegs.map((leg) =>
        leg.id === id ? { ...leg, [field]: value } : leg
      )
    );
  };

  const toggleDayOfWeek = (dayType: "departure" | "return", day: string) => {
    const field =
      dayType === "departure" ? "selectedDepartureDays" : "selectedReturnDays";
    const currentDays = searchParams[field] || [];

    handleFieldChange(
      field,
      currentDays.includes(day)
        ? currentDays.filter((d) => d !== day)
        : [...currentDays, day]
    );
  };

  const addLayoverCity = () => {
    if (
      newLayoverCity &&
      !searchParams.preferredLayoverCities.includes(newLayoverCity)
    ) {
      handleFieldChange("preferredLayoverCities", [
        ...searchParams.preferredLayoverCities,
        newLayoverCity,
      ]);
      setNewLayoverCity("");
    }
  };

  const removeLayoverCity = (city: string) => {
    handleFieldChange(
      "preferredLayoverCities",
      searchParams.preferredLayoverCities.filter((c) => c !== city)
    );
  };

  const parseLayoverTime = (value: string): string => {
    // Convert hour format (e.g., "2h" or "2") to minutes for the API
    const match = value.match(/^(\d+)h?$/);
    return match ? match[1] : "";
  };

  return (
    <div className="w-full">
      {show && (
        <div className="mt-6 rounded-xl p-6 space-y-6">
          {/* Trip Type Selection */}
          <div className="space-y-3">
            <label className="text-white font-medium flex items-center gap-2">
              <Plane size={18} />
              Trip Type
            </label>
            <div className="flex flex-wrap gap-3">
              {["one-way", "roundtrip", "multi-city"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="tripType"
                    value={type}
                    checked={tripType === type}
                    onChange={(e) =>
                      onTripTypeChange(
                        e.target.value as "one-way" | "roundtrip" | "multi-city"
                      )
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-white capitalize">
                    {type.replace("-", " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Multi-City Legs */}
          {tripType === "multi-city" && (
            <div className="space-y-3">
              <label className="text-white font-medium">Flight Legs</label>
              {searchParams.multiCityLegs?.map((leg) => (
                <div key={leg.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="From"
                    className="flex-1 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    value={leg.from}
                    onChange={(e) =>
                      updateMultiCityLeg(leg.id, "from", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="To"
                    className="flex-1 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    value={leg.to}
                    onChange={(e) =>
                      updateMultiCityLeg(leg.id, "to", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    className="flex-1 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    value={leg.date}
                    onChange={(e) =>
                      updateMultiCityLeg(leg.id, "date", e.target.value)
                    }
                  />
                  {searchParams.multiCityLegs!.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeMultiCityLeg(leg.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMultiCityLeg}
                className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
              >
                <Plus size={20} />
                Add another flight
              </button>
            </div>
          )}

          {/* Date Search Options - Only show for non-multi-city trips */}
          {tripType !== "multi-city" && (
            <div className="space-y-3">
              <label className="text-white font-medium flex items-center gap-2">
                <Calendar size={18} />
                Date Search Type
              </label>
              <select
                value={searchParams.dateSearchType}
                onChange={(e) =>
                  handleFieldChange("dateSearchType", e.target.value)
                }
                className="w-full rounded-lg border-0 bg-white backdrop-blur-sm px-4 py-3 text-gray-900 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                <option value="specific">Specific Dates</option>
                <option value="flexible-month">Flexible by Month</option>
                <option value="flexible-days">Flexible by Days of Week</option>
                <option value="duration">Fixed Duration</option>
              </select>

              {searchParams.dateSearchType === "flexible-month" && (
                <div className="flex gap-3">
                  <select
                    value={searchParams.flexibleMonth}
                    onChange={(e) =>
                      handleFieldChange("flexibleMonth", e.target.value)
                    }
                    className="flex-1 rounded-lg border-0 bg-white backdrop-blur-sm px-4 py-3 text-gray-900 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  >
                    <option value="">Select Month</option>
                    {MONTHS.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Year"
                    min="2024"
                    max="2026"
                    value={searchParams.flexibleYear}
                    onChange={(e) =>
                      handleFieldChange("flexibleYear", e.target.value)
                    }
                    className="w-32 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              )}

              {searchParams.dateSearchType === "flexible-days" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-white/80 mb-2">
                      Select departure days
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDayOfWeek("departure", day)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            searchParams.selectedDepartureDays?.includes(day)
                              ? "bg-blue-500 text-white"
                              : "bg-white/20 text-white hover:bg-white/30"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {tripType === "roundtrip" && (
                    <div>
                      <p className="text-sm text-white/80 mb-2">
                        Select return days
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDayOfWeek("return", day)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              searchParams.selectedReturnDays?.includes(day)
                                ? "bg-blue-500 text-white"
                                : "bg-white/20 text-white hover:bg-white/30"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {searchParams.dateSearchType === "duration" && (
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Trip duration (days)"
                    min="1"
                    max="90"
                    value={searchParams.tripDuration}
                    onChange={(e) =>
                      handleFieldChange("tripDuration", e.target.value)
                    }
                    className="flex-1 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                  <div className="flex-1 relative group" style={{ zIndex: 40 }}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Calendar className="h-5 w-5 text-emerald-400" />
                    </div>
                    <DatePicker
                      selected={
                        searchParams.earliestDeparture
                          ? new Date(searchParams.earliestDeparture)
                          : null
                      }
                      onChange={(date: Date | null) =>
                        handleFieldChange(
                          "earliestDeparture",
                          date ? date.toISOString().split("T")[0] : ""
                        )
                      }
                      placeholderText="Earliest departure"
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                      className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-lg border-0 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
                      wrapperClassName="w-full"
                      popperClassName="!z-50"
                      popperPlacement="bottom-start"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Layover Preferences */}
          <div className="space-y-3">
            <label className="text-white font-medium flex items-center gap-2">
              <Clock size={18} />
              Layover Preferences
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={searchParams.maxStops}
                onChange={(e) => handleFieldChange("maxStops", e.target.value)}
                className="rounded-lg border-0 bg-white backdrop-blur-sm px-4 py-3 text-gray-900 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                <option value="any">Any stops</option>
                <option value="0">Non-stop only</option>
                <option value="1">Max 1 stop</option>
                <option value="2">Max 2 stops</option>
              </select>

              <input
                type="text"
                placeholder="Min layover (hours)"
                value={searchParams.minLayoverTime}
                onChange={(e) =>
                  handleFieldChange(
                    "minLayoverTime",
                    parseLayoverTime(e.target.value)
                  )
                }
                className="rounded-lg border-0 bg-white backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />

              <input
                type="text"
                placeholder="Max layover (hours)"
                value={searchParams.maxLayoverTime}
                onChange={(e) =>
                  handleFieldChange(
                    "maxLayoverTime",
                    parseLayoverTime(e.target.value)
                  )
                }
                className="rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm flex items-center gap-2">
                <MapPin size={16} />
                Preferred Layover Cities
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add city (e.g., DXB)"
                  value={newLayoverCity}
                  onChange={(e) =>
                    setNewLayoverCity(e.target.value.toUpperCase())
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addLayoverCity())
                  }
                  className="flex-1 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={addLayoverCity}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchParams.preferredLayoverCities.map((city) => (
                  <span
                    key={city}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500/70 text-white rounded-full text-sm"
                  >
                    {city}
                    <button
                      type="button"
                      onClick={() => removeLayoverCity(city)}
                      className="hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <label className="text-white font-medium flex items-center gap-2">
              <DollarSign size={18} />
              Maximum Price
            </label>
            <input
              type="number"
              placeholder="Max price (optional)"
              value={searchParams.maxPrice}
              onChange={(e) => handleFieldChange("maxPrice", e.target.value)}
              className="w-full rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
