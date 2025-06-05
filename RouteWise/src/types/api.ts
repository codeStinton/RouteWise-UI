// V1 API Types
export interface FlightSearchRequestV1 {
  maxPrice?: number;
  oneWay?: boolean;
  departureDate?: string;
  duration?: number;
  nonStop?: boolean;
}

export interface FlightSearchResponseV1 {
  data: FlightDestinationV1[];
  dictionaries: {
    currencies: Record<string, string>;
    locations: Record<
      string,
      {
        subType: string;
        detailedName: string;
      }
    >;
  };
  meta: {
    currency: string;
    links: {
      self: string;
    };
    defaults: {
      departureDate: string;
      oneWay: boolean;
      duration: string;
      nonStop: boolean;
      viewBy: string;
    };
  };
}

export interface FlightDestinationV1 {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: {
    total: string;
  };
  links: {
    flightDates: string;
    flightOffers: string;
  };
}

// V2 API Types - Updated to match backend DTOs
export interface FlightSearchRequestV2 {
  origin: string;
  destination?: string;
  year?: number;
  month?: number;
  departureDayOfWeek?: number; // 0-6 for Sunday-Saturday
  returnDayOfWeek?: number;
  departureDate?: string;
  returnDate?: string;
  durationDays?: number;
  minLayoverDuration?: number;
  layovers?: number;
  maxPrice?: number;
  adults?: number;
  max?: number;
  resultLimit?: number;
}

export interface FormattedFlightOfferV2 {
  origin: string;
  destination: string;
  price: string;
  departureDate: string;
  returnDate: string;
  layovers: LayoverV2[];
}

export interface LayoverV2 {
  airport: string;
  durationMinutes: number;
  arrivalTimeOfPreviousFlight: string;
  departureTimeOfNextFlight: string;
}

// Multi-city Types - Updated to match backend DTOs
export interface MultiCitySearchRequestV2 {
  originDestinations: OriginDestinationDto[];
  travelers: TravelerDto[];
  sources?: string[];
  searchCriteria?: SearchCriteriaDto;
}

export interface OriginDestinationDto {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
}

export interface TravelerDto {
  travelerType: TravelerType;
  fareOptions: string[];
}

export enum TravelerType {
  ADULT = 0,
  CHILD = 1,
}

export interface SearchCriteriaDto {
  maxFlightOffers: number;
}

// Frontend Display Types
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
  rawData?: any;
}

// Extended FlightParams to support all search modes
export interface FlightParams {
  from: string;
  to: string;
  fromDisplay?: string;
  toDisplay?: string;

  // Date search modes
  dateSearchType: "specific" | "flexible-month" | "flexible-days" | "duration";

  // Specific dates
  departDate?: string;
  returnDate?: string;

  // Flexible month search
  year?: number;
  month?: number;

  // Flexible days of week
  departureDayOfWeek?: number;
  returnDayOfWeek?: number;

  // Duration-based search
  durationDays?: number;
  earliestDeparture?: string;

  // Common parameters
  travellers: number;
  tripType: "one-way" | "roundtrip" | "multi-city";

  // Advanced options
  maxStops?: number;
  minLayoverTime?: number;
  maxLayoverTime?: number;
  preferredLayoverCities?: string[];
  maxPrice?: number;

  // Multi-city specific
  multiCityLegs?: OriginDestinationDto[];
}
