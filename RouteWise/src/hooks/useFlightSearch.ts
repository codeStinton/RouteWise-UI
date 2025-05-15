import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Params {
  origin: string;
  destination: string;
}

export const useFlightSearch = (params: Params) =>
  useQuery(['flights', params], async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/flight/search`,
      { params }
    );
    return data;
  });
