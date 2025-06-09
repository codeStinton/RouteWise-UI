import type { DateSearchType, TripType } from "./search.types";

export interface Flight {
  id: string;
  airline: string;
  departTime: string;
  arriveTime: string;
  departCode: string;
  arriveCode: string;
  duration: string;
  stops: string;
  price: number;
}

export interface FlightSearchParams {
  from: string;
  to: string;
  fromDisplay: string;
  toDisplay: string;
  dateSearchType: DateSearchType;
  departDate?: string;
  returnDate?: string;
  year?: number;
  month?: number;
  departureDayOfWeek?: number;
  returnDayOfWeek?: number;
  durationDays?: number;
  earliestDeparture?: string;
  travellers: number;
  tripType: TripType;
  maxStops?: number;
  minLayoverTime?: number;
  maxLayoverTime?: number;
  preferredLayoverCities?: string[];
  maxPrice?: number;
  multiCityLegs?: Array<{
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
  }>;
}

export interface FilterState {
  priceRange: [number, number];
  stops: string[];
  airlines: string[];
  departureTime: string[];
}
