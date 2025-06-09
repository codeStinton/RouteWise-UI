import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRightLeft,
  ChevronDown,
  Plane,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ReactDatePicker, { type DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdvancedOptions from "./AdvancedOptions";
import AirportSelector from "./AirportSelector";
import type { SearchFormData, TripType } from "../types/search.types";
import { DEFAULT_SEARCH_PARAMS, MONTHS } from "../constants/search";
import { validateSearch } from "../utils/validation";
import { transformSearchParams } from "../utils/searchHelpers";
import { parseDate } from "../utils/formatters";

const DatePicker = ReactDatePicker as unknown as React.FC<DatePickerProps>;

interface SearchFormProps {
  prefilledDestination?: {
    code: string;
    display: string;
  } | null;
}

export default function SearchForm({ prefilledDestination }: SearchFormProps) {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<SearchFormData>(DEFAULT_SEARCH_PARAMS);

  useEffect(() => {
    if (prefilledDestination) {
      setSearchParams(prev => ({
        ...prev,
        to: prefilledDestination.code,
        toDisplay: prefilledDestination.display,
      }));
    }
  }, [prefilledDestination]);

  const handleInputChange = (field: keyof SearchFormData, value: any) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAirportChange = (
    field: "from" | "to",
    code: string,
    displayValue: string
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: code,
      [`${field}Display`]: displayValue,
    }));
  };

  const handleSwapLocations = () => {
    setSearchParams((prev) => ({
      ...prev,
      from: prev.to,
      fromDisplay: prev.toDisplay,
      to: prev.from,
      toDisplay: prev.fromDisplay,
    }));
  };

  const handleSearch = () => {
    const validation = validateSearch(searchParams, tripType);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setTimeout(() => setValidationErrors([]), 5000);
      return;
    }

    setValidationErrors([]);
    const params = transformSearchParams(searchParams, tripType);
    navigate("/results", { state: params });
  };

  const showSpecificDates = searchParams.dateSearchType === "specific" && tripType !== "multi-city";

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
            {/* From Input */}
            <div className="lg:col-span-3 relative group">
              <AirportSelector
                value={searchParams.fromDisplay}
                onChange={(code, display) => handleAirportChange("from", code, display)}
                placeholder="From"
                icon={<MapPin className="h-5 w-5 text-blue-400" />}
              />
            </div>

            {/* Swap Button */}
            <div className="lg:col-span-1 flex items-center justify-center">
              <button
                type="button"
                onClick={handleSwapLocations}
                className="p-2 rounded-full bg-white border border-slate-700/50 text-slate-400 hover:text-white hover:bg-blue-500 hover:rotate-180 transition-all duration-200 transform"
                title="Swap locations"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </button>
            </div>

            {/* To Input */}
            <div className="lg:col-span-3 relative group">
              <AirportSelector
                value={searchParams.toDisplay}
                onChange={(code, display) => handleAirportChange("to", code, display)}
                placeholder="To"
                icon={<MapPin className="h-5 w-5 text-purple-400" />}
              />
            </div>

            {/* Conditional Date Fields */}
            {showSpecificDates ? (
              <>
                {/* Departure Date */}
                <div className="lg:col-span-2 relative group" style={{ zIndex: 40 }}>
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
                    minDate={new Date()}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-300 text-black placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200 cursor-pointer"
                    wrapperClassName="w-full"
                    popperClassName="!z-50"
                    popperPlacement="bottom-start"
                  />
                </div>

                {/* Return Date */}
                <div
                  className={`lg:col-span-2 relative group ${
                    tripType === "one-way" ? "opacity-50 pointer-events-none" : ""
                  }`}
                  style={{ zIndex: 30 }}
                >
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
                    minDate={searchParams.departDate ? new Date(searchParams.departDate) : new Date()}
                    disabled={tripType === "one-way"}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-300 text-black placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-200 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                    wrapperClassName="w-full"
                    popperPlacement="bottom-start"
                    popperClassName="!z-50"
                  />
                </div>
              </>
            ) : (
              <div className="lg:col-span-4 flex items-center justify-center">
                <div className="w-full py-4 px-4 bg-white/10 backdrop-blur-sm rounded-xl border border-slate-700/50 flex items-center justify-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-white font-medium">
                    {searchParams.dateSearchType === "flexible-month" &&
                      `Flexible: ${
                        searchParams.flexibleMonth
                          ? MONTHS.find(m => m.value === searchParams.flexibleMonth)?.label
                          : "Month"
                      } ${searchParams.flexibleYear || "Year"}`}
                    {searchParams.dateSearchType === "flexible-days" &&
                      `Flexible: ${searchParams.selectedDepartureDays?.join(", ") || "Days"}`}
                    {searchParams.dateSearchType === "duration" &&
                      `Duration: ${searchParams.tripDuration || "?"} days`}
                  </span>
                </div>
              </div>
            )}

            {/* Travelers Input */}
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
                className="w-full pl-10 pr-3 py-4 bg-white backdrop-blur-sm rounded-xl border border-slate-700/50 text-black placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all duration-200 text-center appearance-none"
              />
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plane className="h-5 w-5" />
              Search Flights
            </button>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
              <span className="font-medium">Advanced Options</span>
            </button>
          </div>

          {/* Validation Errors */}
          <AnimatePresence>
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-black mb-1">
                      Please correct the following:
                    </h4>
                    <ul className="space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-m text-black flex items-start gap-2">
                          <span className="text-black mt-1">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Options */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <AdvancedOptions
                  show={showAdvanced}
                  onToggle={() => setShowAdvanced(!showAdvanced)}
                  tripType={tripType}
                  onTripTypeChange={setTripType}
                  searchParams={searchParams}
                  onSearchParamsChange={setSearchParams}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}