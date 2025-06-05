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
  AlertCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AdvancedOptions from "./AdvancedOptions";
import AirportSelector from "./AirportSelector";

import ReactDatePicker, { type DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePicker = ReactDatePicker as unknown as React.FC<DatePickerProps>;

export interface SearchFormData {
  from: string;
  fromDisplay: string;
  to: string;
  toDisplay: string;
  departDate: string;
  returnDate: string;
  travellers: string;

  // Advanced options
  dateSearchType: "specific" | "flexible-month" | "flexible-days" | "duration";
  flexibleYear?: string;
  flexibleMonth?: string;
  selectedDepartureDays?: string[];
  selectedReturnDays?: string[];
  tripDuration?: string;
  earliestDeparture?: string;

  // Layover preferences
  maxStops: string;
  minLayoverTime: string;
  maxLayoverTime: string;
  preferredLayoverCities: string[];
  maxPrice?: string;

  // Multi-city
  multiCityLegs?: Array<{
    id: number;
    from: string;
    to: string;
    date: string;
  }>;
}

export default function SearchForm() {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tripType, setTripType] = useState<
    "one-way" | "roundtrip" | "multi-city"
  >("roundtrip");

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const [searchParams, setSearchParams] = useState<SearchFormData>({
    from: "",
    fromDisplay: "",
    to: "",
    toDisplay: "",
    departDate: "",
    returnDate: "",
    travellers: "1",

    // Advanced options
    dateSearchType: "specific",
    flexibleYear: "",
    flexibleMonth: "",
    selectedDepartureDays: [],
    selectedReturnDays: [],
    tripDuration: "",
    earliestDeparture: "",

    // Layover preferences
    maxStops: "any",
    minLayoverTime: "",
    maxLayoverTime: "",
    preferredLayoverCities: [],
    maxPrice: "",

    // Multi-city
    multiCityLegs: [
      { id: 1, from: "", to: "", date: "" },
      { id: 2, from: "", to: "", date: "" },
    ],
  });

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

  const validateSearch = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Basic validation
    if (!searchParams.from || !searchParams.to) {
      errors.push("Please select both departure and arrival airports");
    }

    // Date validation based on search type
    if (tripType === "multi-city") {
      const hasInvalidLeg = searchParams.multiCityLegs?.some(
        (leg) => !leg.from || !leg.to || !leg.date
      );
      if (hasInvalidLeg) {
        errors.push("Please complete all multi-city flight details");
      }
    } else {
      switch (searchParams.dateSearchType) {
        case "specific":
          if (!searchParams.departDate) {
            errors.push("Please select a departure date");
          }
          if (tripType === "roundtrip" && !searchParams.returnDate) {
            errors.push("Please select a return date for round trip");
          }
          break;

        case "flexible-month":
          if (!searchParams.flexibleMonth || !searchParams.flexibleYear) {
            errors.push(
              "Please select both month and year for flexible search"
            );
          }
          break;

        case "flexible-days":
          if (searchParams.selectedDepartureDays?.length === 0) {
            errors.push("Please select at least one departure day");
          }
          if (
            tripType === "roundtrip" &&
            searchParams.selectedReturnDays?.length === 0
          ) {
            errors.push("Please select at least one return day");
          }
          break;

        case "duration":
          if (!searchParams.tripDuration) {
            errors.push("Please specify trip duration");
          }
          if (!searchParams.earliestDeparture) {
            errors.push("Please select earliest departure date");
          }
          break;
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSearch = () => {
    const validation = validateSearch();

    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }

    // Convert day names to numbers for API
    const dayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    navigate("/results", {
      state: {
        from: searchParams.from,
        to: searchParams.to,
        fromDisplay: searchParams.fromDisplay,
        toDisplay: searchParams.toDisplay,
        dateSearchType: searchParams.dateSearchType,
        departDate: searchParams.departDate,
        returnDate: searchParams.returnDate,
        year: searchParams.flexibleYear
          ? parseInt(searchParams.flexibleYear)
          : undefined,
        month: searchParams.flexibleMonth
          ? parseInt(searchParams.flexibleMonth)
          : undefined,
        departureDayOfWeek: searchParams.selectedDepartureDays?.[0]
          ? dayMap[searchParams.selectedDepartureDays[0]]
          : undefined,
        returnDayOfWeek: searchParams.selectedReturnDays?.[0]
          ? dayMap[searchParams.selectedReturnDays[0]]
          : undefined,
        durationDays: searchParams.tripDuration
          ? parseInt(searchParams.tripDuration)
          : undefined,
        earliestDeparture: searchParams.earliestDeparture,
        travellers: parseInt(searchParams.travellers),
        tripType: tripType,
        maxStops:
          searchParams.maxStops === "any"
            ? undefined
            : parseInt(searchParams.maxStops),
        minLayoverTime: searchParams.minLayoverTime
          ? parseInt(searchParams.minLayoverTime)
          : undefined,
        maxLayoverTime: searchParams.maxLayoverTime
          ? parseInt(searchParams.maxLayoverTime)
          : undefined,
        preferredLayoverCities: searchParams.preferredLayoverCities,
        maxPrice: searchParams.maxPrice
          ? parseInt(searchParams.maxPrice)
          : undefined,
        multiCityLegs:
          tripType === "multi-city"
            ? searchParams.multiCityLegs?.map((leg) => ({
                originLocationCode: leg.from,
                destinationLocationCode: leg.to,
                departureDate: leg.date,
              }))
            : undefined,
      },
    });
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

  const parseDate = (value: string) =>
    value ? new Date(`${value}T00:00:00`) : null;

  // Determine if date fields should be shown based on search type
  const showSpecificDates =
    searchParams.dateSearchType === "specific" && tripType !== "multi-city";

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
                onChange={(code, display) =>
                  handleAirportChange("from", code, display)
                }
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
                onChange={(code, display) =>
                  handleAirportChange("to", code, display)
                }
                placeholder="To"
                icon={<MapPin className="h-5 w-5 text-purple-400" />}
              />
            </div>

            {/* Conditional Date Fields */}
            {showSpecificDates ? (
              <>
                {/* Departure Date */}
                <div
                  className="lg:col-span-2 relative group"
                  style={{ zIndex: 40 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Calendar className="h-5 w-5 text-emerald-400" />
                  </div>
                  <DatePicker
                    selected={parseDate(searchParams.departDate)}
                    onChange={(date: Date | null) =>
                      handleInputChange(
                        "departDate",
                        date ? date.toISOString().split("T")[0] : ""
                      )
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
                    tripType === "one-way"
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                  style={{ zIndex: 30 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <CalendarDays className="h-5 w-5 text-amber-400" />
                  </div>
                  <DatePicker
                    selected={parseDate(searchParams.returnDate)}
                    onChange={(date: Date | null) =>
                      handleInputChange(
                        "returnDate",
                        date ? date.toISOString().split("T")[0] : ""
                      )
                    }
                    placeholderText="Return"
                    dateFormat="yyyy-MM-dd"
                    minDate={
                      searchParams.departDate
                        ? new Date(searchParams.departDate)
                        : new Date()
                    }
                    disabled={tripType === "one-way"}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-300 text-black placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-200 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                    wrapperClassName="w-full"
                    popperPlacement="bottom-start"
                    popperClassName="!z-50"
                  />
                </div>
              </>
            ) : (
              /* Placeholder for flexible date info */
              <div className="lg:col-span-4 flex items-center justify-center">
                <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white">
                    {searchParams.dateSearchType === "flexible-month" &&
                      `Flexible: ${
                        searchParams.flexibleMonth
                          ? months.find(
                              (m) => m.value === searchParams.flexibleMonth
                            )?.label
                          : "Month"
                      } ${searchParams.flexibleYear || "Year"}`}
                    {searchParams.dateSearchType === "flexible-days" &&
                      `Flexible: ${
                        searchParams.selectedDepartureDays?.join(", ") || "Days"
                      }`}
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
                onChange={(e) =>
                  handleInputChange("travellers", e.target.value)
                }
                className="w-full pl-10 pr-3 py-4 bg-white backdrop-blur-sm rounded-xl border border-slate-700/50 text-black placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all duration-200 text-center appearance-none"
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

            {/* Advanced Options button */}
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
