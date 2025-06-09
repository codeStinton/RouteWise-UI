import { Building2, Mountain, Camera, Waves } from "lucide-react";
import type { Destination } from "../types/destination.types";

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    city: "Paris",
    country: "France",
    airport: "Charles de Gaulle Airport (CDG)",
    airportCode: "CDG",
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
    airportCode: "HND",
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
    airportCode: "JFK",
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
    airportCode: "SYD",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "Harbour views, beaches and vibrant arts define sunny Sydney.",
    highlights: [
      { name: "Opera House", icon: Building2 },
      { name: "Harbour Bridge", icon: Building2 },
      { name: "Bondi Beach", icon: Waves },
    ],
    rating: 4.6,
    priceFrom: "$1,299",
  },
];
