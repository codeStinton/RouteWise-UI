import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Layout from "../components/Layout";
import AdvancedOptions from "../components/AdvancedOptions";
import type { FlightParams } from "../hooks/useFlightSearch";

export default function HomePage() {
  /* ───────────────────── local state ───────────────────── */
  const [showAdvanced, setShowAdvanced] = useState(false);
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

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* ── Input Row ── */}
            <div className="flex flex-wrap items-start gap-4">
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
              <input
                type="number"
                min={1}
                name="travellers"
                placeholder="Travellers"
                className="flex-1 min-w-[100px] rounded border bg-white px-3 py-2"
              />
              <button
                type="submit"
                className="flex-shrink-0 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            <AdvancedOptions
              show={showAdvanced}
              onToggle={() => setShowAdvanced((p) => !p)}
            />
          </form>
        </Header>
      }
    >
      {/* Split-overlap image section */}
      <div className="relative z-10 flex justify-center -mt-28 mb-10 px-4">
        <div
          className="
      overflow-hidden rounded-xl shadow-lg
      w-full max-w-7xl
      bg-gradient-to-br from-orange-400 to-pink-500
    "
          style={{
            maskImage:
              "radial-gradient(circle at center, black 80%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 80%, transparent 100%)",
          }}
        >
          <img
            src="/assets/water.png"
            alt="Promo image"
            className="w-full h-auto object-cover"
            style={{ aspectRatio: "3 / 1" }}
          />
        </div>
      </div>

      {/* ——— Home body (destinations etc.) ——— */}
      <section className="pt-10 sm:pt-10 md:pt-15 lg:pt-20">
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
