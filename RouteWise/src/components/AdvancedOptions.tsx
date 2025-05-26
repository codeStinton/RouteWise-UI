import { useId } from "react";

interface AdvancedOptionsProps {
  show: boolean;
  onToggle: () => void;
}

export default function AdvancedOptions({ show, onToggle }: AdvancedOptionsProps) {
  const checkboxId = useId();

  return (
    <>
      {/* Toggle Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={show}
          className="rounded border bg-white px-4 py-2 text-sm text-[#021952] hover:bg-gray-100"
        >
          {show ? "Hide Options" : "Advanced Options"}
        </button>
      </div>

      {/* Panel */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          show ? "max-h-[1000px] mt-6" : "max-h-0"
        }`}
      >
        <div className="flex justify-center mt-4">
          <div className="grid w-full max-w-[800px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price ($)"
              className="rounded border bg-white px-3 py-2"
            />
            <select
              name="cabin"
              className="rounded border bg-white px-3 py-2"
            >
              <option value="">Cabin Class</option>
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business</option>
              <option>First</option>
            </select>
            <label htmlFor={checkboxId} className="flex items-center gap-2">
              <input
                id={checkboxId}
                type="checkbox"
                name="directOnly"
                className="h-5 w-5"
              />
              <span className="text-sm">Non-stop only</span>
            </label>
            {/* Extra Fields */}
            <input
              name="airline"
              placeholder="Preferred Airline"
              className="rounded border bg-white px-3 py-2"
            />
            <input
              name="maxLayover"
              type="number"
              placeholder="Max Layover (hrs)"
              className="rounded border bg-white px-3 py-2"
            />
            <select
              name="baggage"
              className="rounded border bg-white px-3 py-2"
            >
              <option value="">Baggage</option>
              <option>No baggage</option>
              <option>Carry-on only</option>
              <option>Checked bag</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}