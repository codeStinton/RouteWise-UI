import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  // ───────────────────────────────────────────────────────────
  //  Data
  // ───────────────────────────────────────────────────────────
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
      city: "Sydney",
      airport: "Kingsford Smith Airport (SYD)",
      image: "/assets/paris.jpg",
      description:
        "Harbour views, beaches and vibrant arts define sunny Sydney.",
    },
  ];

  // ───────────────────────────────────────────────────────────
  //  Scroll‑in animation helpers
  // ───────────────────────────────────────────────────────────
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleStates, setVisibleStates] = useState<boolean[]>(() =>
    new Array(destinationSections.length).fill(false)
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

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
        { threshold: 0.4 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // ───────────────────────────────────────────────────────────
  //  Simple redirect (no Router dependency)
  // ───────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/results";
  };

  // ───────────────────────────────────────────────────────────
  //  Render
  // ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Hero ─────────────────────────────── */}
      <div
        className="
          relative z-10
          bg-[#021952] min-h-[22rem]
          flex flex-col justify-start items-center
          pt-8 pb-16 sm:pb-20 md:pb-28 lg:pb-32
          px-6
        "
      >
        <div className="container mx-auto flex flex-col gap-4 relative z-20">
          {/* logo */}
          <div className="flex items-center gap-2 text-white">
            <span className="text-3xl">✈️</span>
            <h1 className="text-2xl font-bold">RouteWise</h1>
          </div>

          <p className="text-white text-lg font-medium">
            Find your perfect trip in one quick search.
          </p>

          {/* search form */}
          <form
            className="w-full flex flex-wrap items-start gap-4"
            onSubmit={handleSubmit}
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
                onClick={() => setShowAdvanced((p) => !p)}
                aria-expanded={showAdvanced} /* accessibility */
                className="mt-2 rounded border bg-white px-3 py-2 text-sm text-[#021952] hover:bg-gray-100"
              >
                {showAdvanced ? "Hide Options" : "Advanced Options"}
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
                className="
                  rounded bg-blue-600
                  px-6 py-2 font-semibold text-white
                  hover:bg-blue-700
                "
              >
                Search
              </button>
            </div>
            {/* ── Advanced options panel ───────────────── */}
            <div
              className={`
      w-full overflow-hidden
      transition-[max-height] duration-500 ease-in-out
      ${showAdvanced ? "max-h-96 mt-4" : "max-h-0"}
    `}
            >
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[120px]">
                  <input
                    type="number"
                    min="1"
                    placeholder="Max Price ($)"
                    className="w-full rounded border bg-white px-3 py-2"
                  />
                </div>

                <div className="flex-1 min-w-[140px]">
                  <select className="w-full rounded border bg-white px-3 py-2">
                    <option value="">Cabin Class</option>
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business</option>
                    <option>First</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="nonStop" className="h-5 w-5" />
                  <label htmlFor="nonStop" className="text-sm">
                    Non-stop only
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[120px]">
                  <input
                    type="number"
                    min="1"
                    placeholder="Max Price ($)"
                    className="w-full rounded border bg-white px-3 py-2"
                  />
                </div>

                <div className="flex-1 min-w-[140px]">
                  <select className="w-full rounded border bg-white px-3 py-2">
                    <option value="">Cabin Class</option>
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business</option>
                    <option>First</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="nonStop" className="h-5 w-5" />
                  <label htmlFor="nonStop" className="text-sm">
                    Non-stop only
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Overlapping graphic ─────────────────────────────── */}
      <div
        className="
          relative z-30
          container mx-auto px-6
          mt-8 sm:mt-8 md:-mt-20 lg:-mt-28
          pointer-events-none mb-5
        "
      >
        +{" "}
        <img
          src="/assets/placeholder.jpg"
          alt="Feature graphic"
          className="w-10/11 mx-auto block rounded-xl"
        />
      </div>

      {/* ── Destination scroll sections ─────────────────────── */}
      <div className="bg-white pt-20 sm:pt-20 md:pt-28 lg:pt-10">
        <h2 className="text-3xl font-bold text-center mb-8">
          Popular Destinations
        </h2>

        {destinationSections.map((sec, idx) => (
          <div
            key={idx}
            ref={(el) => {
              sectionRefs.current[idx] = el;
            }}
            style={{ transitionDelay: `${idx * 100}ms` }}
            className={
              `max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center gap-10 min-h-[40vh] transition-all duration-700 ease-out transform ` +
              (visibleStates[idx]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12")
            }
          >
            <img
              src={sec.image}
              alt={sec.city}
              className="w-full md:w-1/2 rounded-lg shadow-lg object-cover"
            />
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-3xl font-bold">{sec.city}</h3>
              <p className="text-gray-600 font-medium">{sec.airport}</p>
              <p className="text-gray-700">{sec.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ─────────────────────────────── */}
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
              <path fillRule="evenodd" clipRule="evenodd" d="" />
            </svg>
            <span>RouteWise</span>
          </div>

          <p className="text-sm">
            © 2024 <span className="font-medium">RouteWise</span>. All rights
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
                <path d="" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
