import type { Flight } from "../types/api";

export function generateMockFlights(
  from: string,
  to: string,
  date: string
): Flight[] {
  const airlines = [
    "American Airlines",
    "United Airlines",
    "Delta Airlines",
    "Southwest",
    "JetBlue",
    "Alaska Airlines",
  ];
  const flights: Flight[] = [];

  // Generate 6-10 mock flights
  const numFlights = Math.floor(Math.random() * 5) + 6;

  for (let i = 0; i < numFlights; i++) {
    const departHour = Math.floor(Math.random() * 16) + 6; // 6 AM to 10 PM
    const departMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    const duration = Math.floor(Math.random() * 180) + 120; // 2-5 hours

    const departTime = new Date(date);
    departTime.setHours(departHour, departMinute);

    const arriveTime = new Date(departTime);
    arriveTime.setMinutes(arriveTime.getMinutes() + duration);

    const stops = Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 2) + 1;
    const basePrice = Math.floor(Math.random() * 400) + 150;
    const price = basePrice + stops * -50; // Direct flights cost more

    flights.push({
      id: `mock-${i}`,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      departTime: departTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      arriveTime: arriveTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      departCode: from,
      arriveCode: to,
      duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
      stops: stops === 0 ? "Direct" : stops === 1 ? "1 stop" : `${stops} stops`,
      price: price,
    });
  }

  // Sort by departure time
  return flights.sort((a, b) => a.departTime.localeCompare(b.departTime));
}
