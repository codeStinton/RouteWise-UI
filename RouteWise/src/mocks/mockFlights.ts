import type { Flight } from '../types/flight';

export const mockFlights: Flight[] = [
  {
    id: '1',
    airline: 'Ryanair',
    departTime: '11:00',
    arriveTime: '12:00',
    departCode: 'CWL',
    arriveCode: 'DUB',
    duration: '1h',
    stops: 'Direct',
    price: 260,
  },
  {
    id: '2',
    airline: 'Aer Lingus',
    departTime: '22:10',
    arriveTime: '23:20',
    departCode: 'CWL',
    arriveCode: 'DUB',
    duration: '1h 10',
    stops: 'Direct',
    price: 422,
  },
];
