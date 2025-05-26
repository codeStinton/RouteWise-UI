import { useQuery } from '@tanstack/react-query';
import type { Flight } from '../types/flight';
import { mockFlights } from '../mocks/mockFlights';

export interface FlightParams {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  travellers: number;
  directOnly: boolean;
}


export function useFlightSearch(params: FlightParams) {
  return useQuery<Flight[]>({
    queryKey: ['flights', params],
    queryFn: async () => {
      return mockFlights;
    },
    staleTime: 5 * 60 * 1000,
  });
}
