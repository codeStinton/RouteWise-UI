import type { SearchFormData, TripType } from "../types/search.types";
import type { FlightSearchParams } from "../types/flight.types";
import { DAY_MAP } from "../constants/dates";

export const transformSearchParams = (
  searchParams: SearchFormData,
  tripType: TripType
): FlightSearchParams => {
  return {
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
      ? DAY_MAP[searchParams.selectedDepartureDays[0]]
      : undefined,
    returnDayOfWeek: searchParams.selectedReturnDays?.[0]
      ? DAY_MAP[searchParams.selectedReturnDays[0]]
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
  };
};

export const parseLayoverTime = (value: string): string => {
  const match = value.match(/^(\d+)h?$/);
  return match ? match[1] : "";
};
