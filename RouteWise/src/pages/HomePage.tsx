import { useEffect, useRef, useState } from "react";
import {
  Plane,
  MapPin,
  Star,
  ArrowRight,
  Building2,
  Mountain,
  Camera,
  Waves,
} from "lucide-react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import ImprovedSearchForm from "../components/ImprovedSearchForm";

export default function HomePage() {

  const destinationSections = [
    {
      city: "Paris",
      country: "France",
      airport: "Charles de Gaulle Airport (CDG)",
      image:
        "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop",
      description:
        "One of Europe's most iconic cities, Paris is known for its art, food, and fashion.",
      highlights: [
        { name: "Eiffel Tower", icon: Building2 },
        { name: "Louvre Museum", icon: Camera },
        { name: "Notre-Dame", icon: Building2 },
      ],
      rating: 4.8,
      priceFrom: "$299",
    },
    {
      city: "Tokyo",
      country: "Japan",
      airport: "Haneda Airport (HND)",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
      description:
        "Tokyo blends tradition with cutting-edge modernity in the heart of Japan.",
      highlights: [
        { name: "Shibuya Crossing", icon: Building2 },
        { name: "Mount Fuji", icon: Mountain },
        { name: "Cherry Blossoms", icon: Camera },
      ],
      rating: 4.9,
      priceFrom: "$899",
    },
    {
      city: "New York",
      country: "USA",
      airport: "John F. Kennedy Airport (JFK)",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
      description:
        "The Big Apple offers culture, nightlife, and global influence.",
      highlights: [
        { name: "Statue of Liberty", icon: Building2 },
        { name: "Central Park", icon: Mountain },
        { name: "Broadway", icon: Camera },
      ],
      rating: 4.7,
      priceFrom: "$199",
    },
    {
      city: "Sydney",
      country: "Australia",
      airport: "Kingsford Smith Airport (SYD)",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      description:
        "Harbour views, beaches and vibrant arts define sunny Sydney.",
      highlights: [
        { name: "Opera House", icon: Building2 },
        { name: "Harbour Bridge", icon: Building2 },
        { name: "Bondi Beach", icon: Waves },
      ],
      rating: 4.6,
      priceFrom: "$1,299",
    },
  ];

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(() =>
    new Array(destinationSections.length).fill(false)
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger load animations
    setTimeout(() => setIsLoaded(true), 100);

    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const ob = new IntersectionObserver(
        ([entry]) =>
          setVisible((prev) => {
            const next = [...prev];
            next[i] = entry.isIntersecting;
            return next;
          }),
        { threshold: 0.2 }
      );
      ob.observe(el);
      observers.push(ob);
    });
    return () => observers.forEach((ob) => ob.disconnect());
  }, []);

  return (
    <Layout
      hero={
        <Header>
          <div className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute top-40 right-32 w-24 h-24 bg-blue-300 rounded-full blur-2xl"></div>
              <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-300 rounded-full blur-3xl"></div>
            </div>

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
                <ImprovedSearchForm></ImprovedSearchForm>
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

      {/* Enhanced Destinations Section */}
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
            {destinationSections.map((destination, i) => (
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

                    {/* Enhanced Highlights */}
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

                    {/* Enhanced CTA Button */}
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 group-hover:translate-x-2 shadow-lg hover:shadow-xl">
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
