import { useState, useRef, useEffect } from "react";
import { Plane, X } from "lucide-react";
import { createPortal } from "react-dom";
import { AIRPORTS } from "../constants/airports";
import type { Airport } from "../types/search.types";

interface AirportSelectorProps {
  value: string;
  onChange: (code: string, displayValue: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function AirportSelector({
  value,
  onChange,
  placeholder,
  icon,
  className = "",
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

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const updateDropdownPosition = () => {
    if (!containerRef.current) return;

    const { bottom, left, width } =
      containerRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: bottom + 8,
      left: left,
      width: width,
    });
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
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
    }
  }, [isOpen]);

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
      style={{
        position: "fixed",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
      }}
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
      </div>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </>
  );
}
