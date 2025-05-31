import { useState } from "react";
import {
  Plus,
  X,
  Calendar,
  Clock,
  MapPin,
  Plane
} from "lucide-react";

import ReactDatePicker, { type DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const DatePicker = ReactDatePicker as unknown as React.FC<DatePickerProps>;

interface AdvancedOptionsProps {
  show: boolean;
  onToggle: () => void;
}

export default function AdvancedOptions({
  show,
}: AdvancedOptionsProps) {
  const [tripType, setTripType] = useState("roundtrip");
  const [multiCityLegs, setMultiCityLegs] = useState([
    { id: 1, from: "", to: "", date: "" },
    { id: 2, from: "", to: "", date: "" },
  ]);
  const [dateSearchType, setDateSearchType] = useState("specific");
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<string[]>([]);
  const [layoverPrefs, setLayoverPrefs] = useState({
    maxStops: "any",
    minLayoverTime: "",
    maxLayoverTime: "",
    preferredLayoverCities: [] as string[],
  });
  const [newLayoverCity, setNewLayoverCity] = useState("");

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const addMultiCityLeg = () => {
    const newId = Math.max(...multiCityLegs.map((leg) => leg.id)) + 1;
    setMultiCityLegs([
      ...multiCityLegs,
      { id: newId, from: "", to: "", date: "" },
    ]);
  };

  const removeMultiCityLeg = (id: number) => {
    if (multiCityLegs.length > 2) {
      setMultiCityLegs(multiCityLegs.filter((leg) => leg.id !== id));
    }
  };

  const toggleDayOfWeek = (day: string) => {
    setSelectedDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addLayoverCity = () => {
    if (
      newLayoverCity &&
      !layoverPrefs.preferredLayoverCities.includes(newLayoverCity)
    ) {
      setLayoverPrefs((prev) => ({
        ...prev,
        preferredLayoverCities: [
          ...prev.preferredLayoverCities,
          newLayoverCity,
        ],
      }));
      setNewLayoverCity("");
    }
  };

  const removeLayoverCity = (city: string) => {
    setLayoverPrefs((prev) => ({
      ...prev,
      preferredLayoverCities: prev.preferredLayoverCities.filter(
        (c) => c !== city
      ),
    }));
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
                    onChange={(e) => setTripType(e.target.value)}
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
              {multiCityLegs.map((leg, index) => (
                <div key={leg.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="From"
                    className="flex-1 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    value={leg.from}
                    onChange={(e) => {
                      const updated = [...multiCityLegs];
                      updated[index].from = e.target.value;
                      setMultiCityLegs(updated);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="To"
                    className="flex-1 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    value={leg.to}
                    onChange={(e) => {
                      const updated = [...multiCityLegs];
                      updated[index].to = e.target.value;
                      setMultiCityLegs(updated);
                    }}
                  />
                  <input
                    type="date"
                    className="flex-1 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    value={leg.date}
                    onChange={(e) => {
                      const updated = [...multiCityLegs];
                      updated[index].date = e.target.value;
                      setMultiCityLegs(updated);
                    }}
                  />
                  {multiCityLegs.length > 2 && (
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

          {/* Date Search Options */}
          <div className="space-y-3">
            <label className="text-white font-medium flex items-center gap-2">
              <Calendar size={18} />
              Date Search Type
            </label>
            <select
              value={dateSearchType}
              onChange={(e) => setDateSearchType(e.target.value)}
              className="w-full rounded-lg border-0 bg-white backdrop-blur-sm px-4 py-3 text-gray-900 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
              <option value="specific">Specific Dates</option>
              <option value="flexible-month">Flexible by Month</option>
              <option value="flexible-days">Flexible by Days of Week</option>
              <option value="duration">Fixed Duration</option>
            </select>

            {dateSearchType === "flexible-month" && (
              <div className="flex gap-3">
                <select
                  name="flexibleMonth"
                  className="flex-1 rounded-lg border-0 bg-white backdrop-blur-sm px-4 py-3 text-gray-900 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                  <option value="">Select Month</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="flexibleYear"
                  placeholder="Year"
                  min="2024"
                  max="2026"
                  className="w-32 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            )}

            {dateSearchType === "flexible-days" && (
              <div className="space-y-2">
                <p className="text-sm text-white/80">
                  Select departure and return days
                </p>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDayOfWeek(day)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedDaysOfWeek.includes(day)
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

            {dateSearchType === "duration" && (
              <div className="flex gap-3">
                <input
                  type="number"
                  name="tripDuration"
                  placeholder="Trip duration (days)"
                  min="1"
                  max="90"
                  className="flex-1 rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <div className="flex-1 relative group" style={{ zIndex: 40 }}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Calendar className="h-5 w-5 text-emerald-400" />
                  </div>
                  <DatePicker
                    placeholderText="Earliest departure"
                    dateFormat="yyyy-MM-dd"
                    className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-lg border-0 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
                    wrapperClassName="w-full"
                    popperClassName="!z-50"
                    popperPlacement="bottom-start"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Layover Preferences */}
          <div className="space-y-3">
            <label className="text-white font-medium flex items-center gap-2">
              <Clock size={18} />
              Layover Preferences
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                name="maxStops"
                value={layoverPrefs.maxStops}
                onChange={(e) =>
                  setLayoverPrefs((prev) => ({
                    ...prev,
                    maxStops: e.target.value,
                  }))
                }
                className="rounded-lg border-0 bg-white backdrop-blur-sm px-4 py-3 text-gray-900 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                <option value="non-stop">Non-stop only</option>
                <option value="1">Max 1 stop</option>
                <option value="2">Max 2 stops</option>
                <option value="any">Any stops</option>
              </select>

              <input
                type="text"
                name="minLayoverTime"
                placeholder="Min layover (e.g., 1h)"
                value={layoverPrefs.minLayoverTime}
                onChange={(e) =>
                  setLayoverPrefs((prev) => ({
                    ...prev,
                    minLayoverTime: e.target.value,
                  }))
                }
                className="rounded-lg border-0 bg-white backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />

              <input
                type="text"
                name="maxLayoverTime"
                placeholder="Max layover (e.g., 4h)"
                value={layoverPrefs.maxLayoverTime}
                onChange={(e) =>
                  setLayoverPrefs((prev) => ({
                    ...prev,
                    maxLayoverTime: e.target.value,
                  }))
                }
                className="rounded-lg border-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm flex items-center gap-2">
                <MapPin size={16} />
                Layover Cities
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add city (e.g., Dubai)"
                  value={newLayoverCity}
                  onChange={(e) => setNewLayoverCity(e.target.value)}
                  onKeyPress={(e) =>
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
                {layoverPrefs.preferredLayoverCities.map((city) => (
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
        </div>
      )}
    </div>
  );
}
