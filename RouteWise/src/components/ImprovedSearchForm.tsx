import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRightLeft,
  ChevronDown,
  Plane,
  CalendarDays,
} from "lucide-react";
import AdvancedOptions from "./AdvancedOptions";

// ⚠️ react-datepicker typing can break under strict TS when multiple versions of
// @types/react are hoisted.  The small alias below coerces the library into a
// plain Function Component so VS Code / tsc stop complaining without touching
// the rendered markup or behaviour.
import ReactDatePicker, { type DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const DatePicker = ReactDatePicker as unknown as React.FC<DatePickerProps>;

export default function ImprovedSearchForm() {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    travellers: "1",
  });

  const handleInputChange = (field: string, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    navigate("/results", {
      state: {
        from: searchParams.from,
        to: searchParams.to,
        departDate: searchParams.departDate,
        returnDate: searchParams.returnDate,
        travellers: parseInt(searchParams.travellers),
      },
    });
  };

  const handleSwapLocations = () => {
    setSearchParams((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const parseDate = (value: string) => (value ? new Date(`${value}T00:00:00`) : null);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

        {/* Main form content */}
        <div className="relative z-10">
          {/* Primary Search Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
            {/* From Input */}
            <div className="lg:col-span-3 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <MapPin className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="From"
                value={searchParams.from}
                onChange={(e) => handleInputChange("from", e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 hover:bg-slate-900/70"
              />
            </div>

            {/* Swap/Arrow Button */}
            <div className="lg:col-span-1 flex items-center justify-center">
              <button
                onClick={handleSwapLocations}
                className="p-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 hover:rotate-180 transition-all duration-200 transform"
                title="Swap locations"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </button>
            </div>

            {/* To Input */}
            <div className="lg:col-span-3 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <MapPin className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="To"
                value={searchParams.to}
                onChange={(e) => handleInputChange("to", e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 hover:bg-slate-900/70"
              />
            </div>

            {/* Departure Date */}
            <div className="lg:col-span-2 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Calendar className="h-5 w-5 text-emerald-400" />
              </div>
              <DatePicker
                selected={parseDate(searchParams.departDate)}
                onChange={(date: Date | null) =>
                  handleInputChange("departDate", date ? date.toISOString().split("T")[0] : "")
                }
                placeholderText="Departure"
                dateFormat="yyyy-MM-dd"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200 hover:bg-slate-900/70 cursor-pointer"
                wrapperClassName="w-full"
              />
            </div>

            {/* Return Date */}
            <div className="lg:col-span-2 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <CalendarDays className="h-5 w-5 text-amber-400" />
              </div>
              <DatePicker
                selected={parseDate(searchParams.returnDate)}
                onChange={(date: Date | null) =>
                  handleInputChange("returnDate", date ? date.toISOString().split("T")[0] : "")
                }
                placeholderText="Return"
                dateFormat="yyyy-MM-dd"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-200 hover:bg-slate-900/70 cursor-pointer"
                wrapperClassName="w-full"
              />
            </div>

            {/* Travelers Input - Increased width */}
            <div className="lg:col-span-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Users className="h-5 w-5 text-pink-400" />
              </div>
              <input
                type="number"
                min="1"
                max="9"
                placeholder="1"
                value={searchParams.travellers}
                onChange={(e) => handleInputChange("travellers", e.target.value)}
                className="w-full pl-10 pr-3 py-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all duration-200 hover:bg-slate-900/70 text-center"
              />
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plane className="h-5 w-5" />
              Search Flights
            </button>

            {/* Improved Advanced Options Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
              />
              <span className="font-medium">Advanced Options</span>
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="mt-6">
              <AdvancedOptions
                show={showAdvanced}
                onToggle={() => setShowAdvanced(!showAdvanced)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
