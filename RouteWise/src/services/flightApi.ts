import {
  type FlightSearchRequestV1,
  type FlightSearchResponseV1,
  type FlightSearchRequestV2,
  type FormattedFlightOfferV2,
  type MultiCitySearchRequestV2,
  type Flight,
  type FlightParams,
  type LayoverV2,
  TravelerType,
} from "../types/api";
import { generateMockFlights } from "./mockData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

class FlightApiService {
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 30000
  ) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  // V1 API Search
  async searchFlightsV1(
    origin: string,
    params: FlightSearchRequestV1
  ): Promise<FlightSearchResponseV1> {
    const queryParams = new URLSearchParams();

    if (params.maxPrice !== undefined)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.oneWay !== undefined)
      queryParams.append("oneWay", params.oneWay.toString());
    if (params.departureDate)
      queryParams.append("departureDate", params.departureDate);
    if (params.duration !== undefined)
      queryParams.append("duration", params.duration.toString());
    if (params.nonStop !== undefined)
      queryParams.append("nonStop", params.nonStop.toString());

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/api/FlightSearch/search/${origin}?${queryParams.toString()}`
    );

    return response.json();
  }

  // V2 API Search
  async searchFlightsV2(
    params: FlightSearchRequestV2
  ): Promise<FormattedFlightOfferV2[]> {
    const queryParams = new URLSearchParams();

    // Required fields
    queryParams.append("origin", params.origin);

    // Optional fields - only add if they have values
    if (params.destination)
      queryParams.append("destination", params.destination);
    if (params.year !== undefined)
      queryParams.append("year", params.year.toString());
    if (params.month !== undefined)
      queryParams.append("month", params.month.toString());
    if (params.departureDayOfWeek !== undefined)
      queryParams.append(
        "departureDayOfWeek",
        params.departureDayOfWeek.toString()
      );
    if (params.returnDayOfWeek !== undefined)
      queryParams.append("returnDayOfWeek", params.returnDayOfWeek.toString());
    if (params.departureDate)
      queryParams.append("departureDate", params.departureDate);
    if (params.returnDate) queryParams.append("returnDate", params.returnDate);
    if (params.durationDays !== undefined)
      queryParams.append("durationDays", params.durationDays.toString());
    if (params.minLayoverDuration !== undefined)
      queryParams.append(
        "minLayoverDuration",
        params.minLayoverDuration.toString()
      );
    if (params.layovers !== undefined)
      queryParams.append("layovers", params.layovers.toString());
    if (params.maxPrice !== undefined)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.adults !== undefined)
      queryParams.append("adults", params.adults.toString());
    if (params.max !== undefined)
      queryParams.append("max", params.max.toString());
    if (params.resultLimit !== undefined)
      queryParams.append("resultLimit", params.resultLimit.toString());

    console.log("V2 API Request:", queryParams.toString());

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/api/FlightSearch/explore?${queryParams.toString()}`
    );

    return response.json();
  }

  // Multi-city Search
  async searchMultiCity(request: MultiCitySearchRequestV2): Promise<any> {
    console.log("Multi-city API Request:", JSON.stringify(request, null, 2));

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/api/FlightSearch/multi-city`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    return response.json();
  }

  // Transform V2 data to frontend format
  private transformV2ToFrontend(data: FormattedFlightOfferV2[]): Flight[] {
    if (!Array.isArray(data)) {
      console.error("Invalid V2 response format:", data);
      return [];
    }

    return data.map((offer, index) => {
      const departTime = new Date(offer.departureDate);
      const layoverInfo = this.calculateLayoverInfo(offer.layovers);

      return {
        id: `v2-${index}`,
        airline: "Multiple Airlines", // V2 doesn't provide airline info
        departTime: departTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        arriveTime: layoverInfo.arrivalTime,
        departCode: offer.origin,
        arriveCode: offer.destination,
        duration: layoverInfo.totalDuration,
        stops: layoverInfo.stopsText,
        price: parseFloat(offer.price),
        rawData: offer,
      };
    });
  }

  // Transform V1 data to frontend format
  private transformV1ToFrontend(data: FlightSearchResponseV1): Flight[] {
    if (!data?.data || !Array.isArray(data.data)) {
      console.error("Invalid V1 response format:", data);
      return [];
    }

    return data.data.map((flight, index) => ({
      id: `v1-${index}`,
      airline: "Various Airlines",
      departTime: "08:00", // V1 doesn't provide specific times
      arriveTime: "10:30", // V1 doesn't provide specific times
      departCode: flight.origin,
      arriveCode: flight.destination,
      duration: "2h 30m", // V1 doesn't provide duration
      stops: "Direct", // V1 doesn't provide stop info
      price: parseFloat(flight.price.total),
      rawData: flight,
    }));
  }

  private calculateLayoverInfo(layovers: LayoverV2[]) {
    if (!layovers || layovers.length === 0) {
      return {
        arrivalTime: "10:00", // Default if no layover info
        totalDuration: "2h 00m",
        stopsText: "Direct",
      };
    }

    const lastLayover = layovers[layovers.length - 1];
    const arrivalTime = new Date(lastLayover.departureTimeOfNextFlight);
    const totalMinutes =
      layovers.reduce((sum, l) => sum + l.durationMinutes, 0) + 120; // Add estimated flight time

    return {
      arrivalTime: arrivalTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      totalDuration: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
      stopsText: layovers.length === 1 ? "1 stop" : `${layovers.length}+ stops`,
    };
  }

  // Main search method that decides which API to use
  async searchFlights(params: FlightParams): Promise<Flight[]> {
    // Use mock data if configured
    if (USE_MOCK_DATA) {
      return generateMockFlights(
        params.from,
        params.to,
        params.departDate || new Date().toISOString().split("T")[0]
      );
    }

    try {
      if (params.tripType === "multi-city" && params.multiCityLegs) {
        // Use multi-city API
        const request: MultiCitySearchRequestV2 = {
          originDestinations: params.multiCityLegs,
          travelers: [
            {
              travelerType: TravelerType.ADULT,
              fareOptions: ["STANDARD"],
            },
          ],
          sources: ["GDS"],
          searchCriteria: {
            maxFlightOffers: 50,
          },
        };

        const data = await this.searchMultiCity(request);
        // Transform multi-city data (implementation depends on actual response format)
        return this.transformV2ToFrontend(
          Array.isArray(data) ? data : data.data || []
        );
      } else {
        // Use V2 API for regular searches
        const v2Params: FlightSearchRequestV2 = {
          origin: params.from,
          destination: params.to,
          adults: params.travellers,
          max: 50,
          resultLimit: 50,
        };

        // Add parameters based on date search type
        switch (params.dateSearchType) {
          case "specific":
            if (params.departDate) v2Params.departureDate = params.departDate;
            if (params.returnDate && params.tripType === "roundtrip") {
              v2Params.returnDate = params.returnDate;
            }
            break;

          case "flexible-month":
            if (params.year) v2Params.year = params.year;
            if (params.month) v2Params.month = params.month;
            break;

          case "flexible-days":
            if (params.departureDayOfWeek !== undefined) {
              v2Params.departureDayOfWeek = params.departureDayOfWeek;
            }
            if (
              params.returnDayOfWeek !== undefined &&
              params.tripType === "roundtrip"
            ) {
              v2Params.returnDayOfWeek = params.returnDayOfWeek;
            }
            break;

          case "duration":
            if (params.durationDays)
              v2Params.durationDays = params.durationDays;
            if (params.earliestDeparture)
              v2Params.departureDate = params.earliestDeparture;
            break;
        }

        // Add layover preferences
        if (params.maxStops !== undefined && params.maxStops >= 0) {
          v2Params.layovers = params.maxStops;
        }
        if (params.minLayoverTime !== undefined) {
          v2Params.minLayoverDuration = params.minLayoverTime;
        }
        if (params.maxPrice !== undefined) {
          v2Params.maxPrice = params.maxPrice;
        }

        console.log("Sending V2 request with params:", v2Params);
        const data = await this.searchFlightsV2(v2Params);
        return this.transformV2ToFrontend(data);
      }
    } catch (error) {
      console.error("Flight search error:", error);

      // Fallback to V1 API if V2 fails
      try {
        const v1Params: FlightSearchRequestV1 = {
          departureDate: params.departDate,
          oneWay: params.tripType === "one-way",
          nonStop: params.maxStops === 0,
          maxPrice: params.maxPrice,
        };

        // For duration-based search in V1
        if (params.dateSearchType === "duration" && params.durationDays) {
          v1Params.duration = params.durationDays;
        }

        console.log("Falling back to V1 with params:", v1Params);
        const data = await this.searchFlightsV1(params.from, v1Params);
        return this.transformV1ToFrontend(data);
      } catch (v1Error) {
        console.error("V1 API fallback also failed:", v1Error);

        // If all APIs fail and we're in development, return mock data
        if (import.meta.env.DEV) {
          console.warn("Using mock data due to API failure");
          return generateMockFlights(
            params.from,
            params.to,
            params.departDate || new Date().toISOString().split("T")[0]
          );
        }

        throw new Error("Failed to search flights. Please try again later.");
      }
    }
  }
}

export const flightApi = new FlightApiService();
