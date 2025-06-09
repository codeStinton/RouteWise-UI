export interface Destination {
    city: string;
    country: string;
    airport: string;
    airportCode: string;
    image: string;
    description: string;
    highlights: Array<{
      name: string;
      icon: any;
    }>;
    rating: number;
    priceFrom: string;
  }