import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const destinationSections = [
    {
      city: "Paris",
      airport: "Charles de Gaulle Airport (CDG)",
      image: "/assets/paris.jpg",
      description:
        "One of Europe’s most iconic cities, Paris is known for its art, food, and fashion.",
    },
    {
      city: "Tokyo",
      airport: "Haneda Airport (HND)",
      image: "/assets/paris.jpg",
      description:
        "Tokyo blends tradition with cutting-edge modernity in the heart of Japan.",
    },
    {
      city: "New York",
      airport: "John F. Kennedy Airport (JFK)",
      image: "/assets/paris.jpg",
      description:
        "The Big Apple offers culture, nightlife, and global influence.",
    },
    {
      city: "Paris",
      airport: "Charles de Gaulle Airport (CDG)",
      image: "/assets/paris.jpg",
      description:
        "One of Europe’s most iconic cities, Paris is known for its art, food, and fashion.",
    },
  ];

  const [visibleStates, setVisibleStates] = useState<boolean[]>(() =>
    new Array(destinationSections.length).fill(false)
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisibleStates((prev) => {
            const next = [...prev];
            next[index] = entry.isIntersecting;
            return next;
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* ─── Blue header ─── */}
      <div className="h-[45vh] bg-[#021952] flex flex-col justify-start items-center pt-8 px-6">
        <div className="container mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white">
            <span className="text-3xl">✈️</span>
            <h1 className="text-2xl font-bold">RouteWise</h1>
          </div>
          <p className="text-white text-lg font-medium">
            Find your perfect trip in one quick search.
          </p>

          <form
            className="w-full flex flex-wrap items-start gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/results");
            }}
          >
            <div className="flex flex-col flex-1 min-w-[120px]">
              <input
                type="text"
                placeholder="From"
                className="w-full rounded border bg-white px-3 py-2"
              />
              <label className="mt-1 flex items-center gap-2 text-sm text-white">
                <input type="checkbox" className="h-4 w-4" />
                Direct flights
              </label>
            </div>

            <div className="flex-1 min-w-[120px]">
              <input
                type="text"
                placeholder="To"
                className="w-full rounded border bg-white px-3 py-2"
              />
            </div>

            <div className="flex flex-col flex-1 min-w-[140px]">
              <input
                type="date"
                placeholder="Depart From"
                className="w-full rounded border bg-white px-3 py-2"
              />
              <button
                type="button"
                className="mt-2 rounded border px-3 py-2 text-sm text-[#021952] bg-white hover:bg-gray-100"
              >
                Advanced Options
              </button>
            </div>

            <div className="flex-1 min-w-[140px]">
              <input
                type="date"
                placeholder="Return To"
                className="w-full rounded border bg-white px-3 py-2"
              />
            </div>

            <div className="flex-1 min-w-[100px]">
              <input
                type="number"
                min="1"
                placeholder="Travellers"
                className="w-full rounded border bg-white px-3 py-2"
              />
            </div>

            <div className="flex-shrink-0">
              <button
                type="submit"
                className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ─── Overlapping graphic ─── */}
      <div className="container mx-auto px-6 -mt-80 mb-20">
        <img
          src="/assets/placeholder.jpg"
          alt="Feature graphic"
          className="w-full block rounded-xl"
        />
      </div>

      {/* ─── Destination scroll sections ─── */}
      <div className="bg-white">
        <h2 className="text-3xl font-bold text-center">Popular Destinations</h2>
        {destinationSections.map((section, idx) => (
          <div
            key={idx}
            ref={(el) => {
              sectionRefs.current[idx] = el;
            }}
            style={{ transitionDelay: `${idx * 100}ms` }}
            className={`transition-all duration-700 ease-out transform px-6 py-6 min-h-[40vh] flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto ${
              visibleStates[idx]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <img
              src={section.image}
              alt={section.city}
              className="w-full md:w-1/2 rounded-lg shadow-lg object-cover"
            />
            <div className="text-left space-y-4 md:w-1/2">
              <h2 className="text-3xl font-bold">{section.city}</h2>
              <p className="text-gray-600 font-medium">{section.airport}</p>
              <p className="text-gray-700">{section.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Footer─── */}
      <footer className="bg-[#021952] text-white px-6 py-10 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 text-xl font-bold">
            <svg
              width="24"
              height="24"
              fill="currentColor"
              className="text-blue-600"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.6745 16.9224L12.6233 10.378C12.2167 9.85117 11.4185 9.8611 11.0251 10.3979L6.45728 16.631C6.26893 16.888 5.96935 17.0398 5.65069 17.0398H3.79114C2.9635 17.0398 2.49412 16.0919 2.99583 15.4336L11.0224 4.90319C11.4206 4.38084 12.2056 4.37762 12.608 4.89668L20.9829 15.6987C21.4923 16.3558 21.024 17.3114 20.1926 17.3114H18.4661C18.1562 17.3114 17.8638 17.1677 17.6745 16.9224ZM12.5866 15.5924L14.8956 18.3593C15.439 19.0105 14.976 20 14.1278 20H9.74075C8.9164 20 8.4461 19.0586 8.94116 18.3994L11.0192 15.6325C11.4065 15.1169 12.1734 15.0972 12.5866 15.5924Z"
              />
            </svg>
            <span>RouteWise</span>
          </div>

          <p className="text-sm">
            ©2024 <span className="font-medium">RouteWise</span>. All rights
            reserved.
          </p>

          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-blue-600">
              License
            </a>
            <a href="#" className="hover:text-blue-600">
              Help
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
            <a href="#" className="hover:text-blue-600">
              Privacy
            </a>
          </div>

          <div className="flex gap-4 mt-2">
            <a href="#" aria-label="GitHub" className="hover:text-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.014c0 4.426 2.865 8.179 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.153-1.11-1.46-1.11-1.46-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.087.636-1.337-2.22-.254-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.276.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.851.004 1.707.115 2.506.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.38.202 2.402.1 2.656.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.694-4.566 4.943.359.309.679.919.679 1.852 0 1.337-.012 2.415-.012 2.743 0 .268.18.58.688.481A10.019 10.019 0 0022 12.014C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
