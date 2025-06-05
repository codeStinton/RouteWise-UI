import { useQuery } from "@tanstack/react-query";
import { flightApi } from "../services/flightApi";
import type { FlightParams, Flight } from "../types/api";

export { type FlightParams };

export function useFlightSearch(params: FlightParams) {
  return useQuery<Flight[], Error>({
    queryKey: ["flights", params],
    queryFn: () => flightApi.searchFlights(params),
    enabled: !!params.from && !!params.to,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}