import { useEffect, useRef, useState } from "react";
import { Plane, MapPin, Star, ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import { POPULAR_DESTINATIONS } from "../constants/destinations";
import type { Destination } from "../types/destination.types";

export default function HomePage() {
  const searchFormRef = useRef<HTMLDivElement>(null);
  const [prefilledDestination, setPrefilledDestination] = useState<{
    code: string;
    display: string;
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(() =>
    new Array(POPULAR_DESTINATIONS.length).fill(false)
  );

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);

    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisible((prev) => {
            const next = [...prev];
            next[i] = entry.isIntersecting;
            return next;
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const handleSearchFlights = (destination: Destination) => {
    setPrefilledDestination({
      code: destination.airportCode,
      display: `${destination.city} - ${destination.airport}`,
    });

    searchFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <Layout
      hero={
        <Header>
          <div className="relative overflow-hidden">
            <div className="relative container mx-auto px-6 py-16">
              {/* Logo and Title */}
              <div
                className={`text-center mb-16 transition-all duration-1000 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <Plane className="text-white" size={40} />
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-white">
                    RouteWise
                  </h1>
                </div>
                <p className="text-2xl text-blue-100 font-light">
                  Find your perfect trip in one quick search.
                </p>
              </div>

              {/* Search Form */}
              <div
                ref={searchFormRef}
                className={`transition-all duration-1000 delay-300 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <SearchForm prefilledDestination={prefilledDestination} />
              </div>
            </div>
          </div>
        </Header>
      }
    >
      {/* Hero image section */}
      <div
        className={`relative z-10 flex justify-center px-6 py-16 transition-all duration-1000 delay-500 ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-3xl shadow-2xl w-full max-w-7xl transform transition-transform duration-500 hover:scale-[1.02]">
          <div className="relative">
            <img
              src="assets/water.png"
              alt="Airplane wing view - beautiful sky and clouds"
              className="w-full h-auto object-cover"
              style={{ aspectRatio: "3 / 1" }}
            />
          </div>
        </div>
      </div>

      {/* Popular Destinations Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 max-w-8xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Popular Destinations
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover amazing places around the world with unbeatable flight
              deals
            </p>
          </div>

          <div className="grid gap-12 max-w-7xl mx-auto">
            {POPULAR_DESTINATIONS.map((destination, i) => (
              <div
                key={i}
                ref={(el) => {
                  sectionRefs.current[i] = el;
                }}
                style={{ transitionDelay: `${i * 200}ms` }}
                className={`group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 ease-out overflow-hidden transform ${
                  visible[i]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-1/2 relative overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.city}
                      className="w-full h-96 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">
                        {destination.rating}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg">
                      From {destination.priceFrom}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-1/2 p-10 lg:p-12">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <span className="text-blue-600 font-semibold text-lg">
                        {destination.country}
                      </span>
                    </div>

                    <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                      {destination.city}
                    </h3>

                    <p className="text-blue-600 font-semibold mb-6 text-lg">
                      {destination.airport}
                    </p>

                    <p className="text-gray-700 text-xl leading-relaxed mb-8">
                      {destination.description}
                    </p>

                    {/* Highlights */}
                    <div className="mb-10">
                      <h4 className="font-bold text-gray-900 mb-4 text-lg">
                        Top Attractions:
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {destination.highlights.map((highlight, idx) => {
                          const IconComponent = highlight.icon;
                          return (
                            <span
                              key={idx}
                              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 border border-blue-100 hover:shadow-md transition-all duration-300 hover:scale-105"
                            >
                              <IconComponent size={16} />
                              {highlight.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSearchFlights(destination)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 group-hover:translate-x-2 shadow-lg hover:shadow-xl"
                    >
                      Search Flights
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
