import { MONTHS } from "./dates";
export { MONTHS };

export const DEFAULT_SEARCH_PARAMS = {
  from: "",
  fromDisplay: "",
  to: "",
  toDisplay: "",
  departDate: "",
  returnDate: "",
  travellers: "1",
  dateSearchType: "specific" as const,
  flexibleYear: "",
  flexibleMonth: "",
  selectedDepartureDays: [],
  selectedReturnDays: [],
  tripDuration: "",
  earliestDeparture: "",
  maxStops: "any",
  minLayoverTime: "",
  maxLayoverTime: "",
  preferredLayoverCities: [],
  maxPrice: "",
  multiCityLegs: [
    { id: 1, from: "", to: "", date: "" },
    { id: 2, from: "", to: "", date: "" },
  ],
};
