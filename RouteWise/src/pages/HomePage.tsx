import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Layout from "../components/Layout";
import type { FlightParams } from "../hooks/useFlightSearch";

export default function HomePage() {
  /* ───────────────────── local state ───────────────────── */
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();

  /* simple fade-in animation for the destination sections */
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

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(() =>
    new Array(destinationSections.length).fill(false)
  );
  useEffect(() => {
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
        { threshold: 0.4 }
      );
      ob.observe(el);
      observers.push(ob);
    });
    return () => observers.forEach((ob) => ob.disconnect());
  }, []);

  /* ─────────────────── form submission ─────────────────── */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params: FlightParams = {
      from: fd.get("from") as string,
      to: fd.get("to") as string,
      departDate: fd.get("departDate") as string,
      returnDate: fd.get("returnDate") as string,
      travellers: +(fd.get("travellers") as string),
      directOnly: !!fd.get("directOnly"),
    };
    navigate("/results", { state: params });
  };

  /* ─────────────────────── render ──────────────────────── */
  return (
    <Layout
      hero={
        <Header className="pb-16 sm:pb-20 md:pb-28 lg:pb-32">
          <p className="text-lg font-medium text-white">
            Find your perfect trip in one quick search.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-wrap items-start gap-4"
          >
            {/* From / To */}
            <input
              name="from"
              placeholder="From"
              className="flex-1 min-w-[120px] rounded border bg-white px-3 py-2"
            />
            <input
              name="to"
              placeholder="To"
              className="flex-1 min-w-[120px] rounded border bg-white px-3 py-2"
            />

            {/* Dates */}
            <input
              type="date"
              name="departDate"
              className="flex-1 min-w-[140px] rounded border bg-white px-3 py-2"
            />
            <input
              type="date"
              name="returnDate"
              className="flex-1 min-w-[140px] rounded border bg-white px-3 py-2"
            />

            {/* Travellers */}
            <input
              type="number"
              min={1}
              name="travellers"
              placeholder="Travellers"
              className="flex-1 min-w-[100px] rounded border bg-white px-3 py-2"
            />

            {/* Advanced-options button */}
            <button
              type="button"
              onClick={() => setShowAdvanced((p) => !p)}
              aria-expanded={showAdvanced}
              className="mt-2 rounded border bg-white px-3 py-2 text-sm text-[#021952] hover:bg-gray-100"
            >
              {showAdvanced ? "Hide Options" : "Advanced Options"}
            </button>

            {/* Submit */}
            <button
              type="submit"
              className="flex-shrink-0 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>

            {/* ── Collapsible panel ── */}
            <div
              className={`w-full overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                showAdvanced ? "max-h-96 mt-4" : "max-h-0"
              }`}
            >
              <div className="flex flex-wrap gap-4">
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price ($)"
                  className="flex-1 min-w-[120px] rounded border bg-white px-3 py-2"
                />
                <select
                  name="cabin"
                  className="flex-1 min-w-[140px] rounded border bg-white px-3 py-2"
                >
                  <option value="">Cabin Class</option>
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="directOnly"
                    className="h-5 w-5"
                  />
                  <span className="text-sm">Non-stop only</span>
                </label>
              </div>
            </div>
          </form>
        </Header>
      }
    >
      {/* ——— Home body (destinations etc.) ——— */}
      <section className="pt-20 sm:pt-20 md:pt-28 lg:pt-32">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Popular Destinations
        </h2>

        {destinationSections.map((sec, i) => (
          <div
            key={i}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            style={{ transitionDelay: `${i * 100}ms` }}
            className={`mx-auto flex min-h-[40vh] max-w-5xl flex-col items-center gap-10 px-6 py-6 transition-all duration-700 ease-out md:flex-row ${
              visible[i]
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <img
              src={sec.image}
              alt={sec.city}
              className="w-full rounded-lg object-cover shadow-lg md:w-1/2"
            />
            <div className="space-y-4 md:w-1/2">
              <h3 className="text-3xl font-bold">{sec.city}</h3>
              <p className="font-medium text-gray-600">{sec.airport}</p>
              <p className="text-gray-700">{sec.description}</p>
            </div>
          </div>
        ))}
      </section>
    </Layout>
  );
}
