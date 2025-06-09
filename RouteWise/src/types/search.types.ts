export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface MultiCityLeg {
  id: number;
  from: string;
  to: string;
  date: string;
}

export interface SearchFormData {
  from: string;
  fromDisplay: string;
  to: string;
  toDisplay: string;
  departDate: string;
  returnDate: string;
  travellers: string;

  // Advanced options
  dateSearchType: DateSearchType;
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
  multiCityLegs?: MultiCityLeg[];
}

export type TripType = "one-way" | "roundtrip" | "multi-city";

export type DateSearchType = "specific" | "flexible-month" | "flexible-days" | "duration";

