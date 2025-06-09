import { Clock, Plane, MapPin, ArrowRight } from "lucide-react";
import type { FlightCardProps } from "../types/flight.types";

export default function FlightCard({
  airline,
  departTime,
  arriveTime,
  departCode,
  arriveCode,
  duration,
  stops,
  price,
}: FlightCardProps) {
  const isDirectFlight = stops.toLowerCase().includes("direct");

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">{airline}</span>
            </div>

            {/* Flight Times and Route */}
            <div className="space-y-3">
              <div className="flex items-center justify-between lg:justify-start lg:gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {departTime}
                  </div>
                  <div className="text-sm text-gray-500 font-medium mt-1">
                    {departCode}
                  </div>
                </div>

                <div className="flex flex-col items-center px-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-gray-400"></div>
                    {isDirectFlight ? (
                      <Plane className="w-4 h-4 text-blue-500" />
                    ) : (
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    )}
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-400 to-gray-300"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {duration}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {arriveTime}
                  </div>
                  <div className="text-sm text-gray-500 font-medium mt-1">
                    {arriveCode}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span
                    className={
                      isDirectFlight ? "text-green-600 font-medium" : ""
                    }
                  >
                    {stops}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex flex-col items-center lg:items-end gap-4 lg:min-w-0 lg:w-48">
            <div className="text-center lg:text-right">
              <div className="text-3xl font-bold text-gray-900">{price}</div>
              <div className="text-sm text-gray-500 mt-1">per person</div>
            </div>

            <button className="w-full lg:w-auto group/btn bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <span>Select Flight</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
}
