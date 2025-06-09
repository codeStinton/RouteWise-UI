import { useState, useEffect } from "react";
import type { Flight, FlightSearchParams } from "../types/flight.types";
import { flightApi } from "../services/flightApi";

export function useFlightSearch(params: FlightSearchParams) {
  const [data, setData] = useState<Flight[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiParams = {
          from: params.from,
          to: params.to,
          travellers: params.travellers,
          tripType: params.tripType,
          dateSearchType: params.dateSearchType,
          departDate: params.departDate,
          returnDate: params.returnDate,
          year: params.year,
          month: params.month,
          departureDayOfWeek: params.departureDayOfWeek,
          returnDayOfWeek: params.returnDayOfWeek,
          durationDays: params.durationDays,
          earliestDeparture: params.earliestDeparture,
          maxStops: params.maxStops,
          minLayoverTime: params.minLayoverTime,
          maxLayoverTime: params.maxLayoverTime,
          preferredLayoverCities: params.preferredLayoverCities,
          maxPrice: params.maxPrice,
          multiCityLegs: params.multiCityLegs,
        };

        const flights = await flightApi.searchFlights(apiParams);
        setData(flights);
      } catch (err) {
        console.error("Flight search error:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch flights. Please try again.")
        );
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [params]);

  return { data, isLoading, error };
}
