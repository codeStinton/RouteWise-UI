import { useState, useRef, useEffect } from "react";
import { Plane, X } from "lucide-react";
import { createPortal } from "react-dom";

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

// Common airports - in production, this would come from an API
const AIRPORTS: Airport[] = [
  {
    code: "JFK",
    name: "John F. Kennedy International",
    city: "New York",
    country: "USA",
  },
  {
    code: "LAX",
    name: "Los Angeles International",
    city: "Los Angeles",
    country: "USA",
  },
  { code: "LHR", name: "Heathrow", city: "London", country: "UK" },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France" },
  { code: "ORY", name: "Orly", city: "Paris", country: "France" },
  {
    code: "MAD",
    name: "Adolfo Suárez Madrid-Barajas",
    city: "Madrid",
    country: "Spain",
  },
  {
    code: "FCO",
    name: "Leonardo da Vinci-Fiumicino",
    city: "Rome",
    country: "Italy",
  },
  {
    code: "SFO",
    name: "San Francisco International",
    city: "San Francisco",
    country: "USA",
  },
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
  {
    code: "SIN",
    name: "Singapore Changi",
    city: "Singapore",
    country: "Singapore",
  },
  { code: "HND", name: "Haneda", city: "Tokyo", country: "Japan" },
  {
    code: "SYD",
    name: "Sydney Kingsford Smith",
    city: "Sydney",
    country: "Australia",
  },
  {
    code: "ATH",
    name: "Athens International",
    city: "Athens",
    country: "Greece",
  },
  {
    code: "AMS",
    name: "Amsterdam Schiphol",
    city: "Amsterdam",
    country: "Netherlands",
  },
  { code: "BKK", name: "Suvarnabhumi", city: "Bangkok", country: "Thailand" },
  {
    code: "DEL",
    name: "Indira Gandhi International",
    city: "New Delhi",
    country: "India",
  },
  {
    code: "IST",
    name: "Istanbul Airport",
    city: "Istanbul",
    country: "Turkey",
  },
  { code: "MUC", name: "Munich Airport", city: "Munich", country: "Germany" },
  {
    code: "BCN",
    name: "Barcelona-El Prat",
    city: "Barcelona",
    country: "Spain",
  },
  { code: "MIA", name: "Miami International", city: "Miami", country: "USA" },
];

interface AirportSelectorProps {
  value: string;
  onChange: (code: string, displayValue: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
  usePortal?: boolean; // Option to use portal or not
}

export default function AirportSelector({
  value,
  onChange,
  placeholder,
  icon,
  className = "",
  usePortal = true,
}: AirportSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [displayValue, setDisplayValue] = useState(value);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when value prop changes
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  // Calculate dropdown position for portal
  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px margin
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen && usePortal) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen && usePortal) {
        updateDropdownPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    if (usePortal) {
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (usePortal) {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [isOpen, usePortal]);

  useEffect(() => {
    if (isOpen && usePortal) {
      updateDropdownPosition();
    }
  }, [isOpen, usePortal]);

  const filteredAirports = AIRPORTS.filter((airport) => {
    const searchLower = search.toLowerCase();
    return (
      airport.code.toLowerCase().includes(searchLower) ||
      airport.name.toLowerCase().includes(searchLower) ||
      airport.city.toLowerCase().includes(searchLower) ||
      airport.country.toLowerCase().includes(searchLower)
    );
  });

  const handleSelect = (airport: Airport) => {
    const display = `${airport.city} (${airport.code})`;
    setDisplayValue(display);
    onChange(airport.code, display);
    setSearch("");
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setDisplayValue(value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    setSearch(displayValue);
  };

  const clearInput = () => {
    setSearch("");
    setDisplayValue("");
    onChange("", "");
    inputRef.current?.focus();
  };

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-[9999]"
      style={
        usePortal
          ? {
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }
          : {}
      }
    >
      {filteredAirports.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No airports found</div>
      ) : (
        <ul>
          {filteredAirports.map((airport) => (
            <li key={airport.code}>
              <button
                type="button"
                onClick={() => handleSelect(airport)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-start gap-3 transition-colors"
              >
                <div className="mt-1">
                  <Plane className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {airport.city} ({airport.code})
                  </div>
                  <div className="text-sm text-gray-600">{airport.name}</div>
                  <div className="text-xs text-gray-500">{airport.country}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <>
      <div ref={containerRef} className="relative">
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              {icon}
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={`w-full ${
              icon ? "pl-12" : "pl-4"
            } pr-12 py-4 bg-white rounded-xl border border-slate-300 text-black placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 ${className}`}
          />
          {displayValue && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Non-portal dropdown (fallback) */}
        {isOpen && !usePortal && (
          <div className="absolute z-50 w-full mt-2">{dropdownContent}</div>
        )}
      </div>

      {/* Portal dropdown */}
      {isOpen &&
        usePortal &&
        typeof document !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </>
  );
}