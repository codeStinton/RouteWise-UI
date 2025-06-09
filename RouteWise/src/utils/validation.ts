import type { SearchFormData, TripType } from "../types/search.types";

export const validateSearch = (
  searchParams: SearchFormData,
  tripType: TripType
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!searchParams.from || !searchParams.to) {
    errors.push("Please select both departure and arrival airports");
  }

  if (tripType === "multi-city") {
    const hasInvalidLeg = searchParams.multiCityLegs?.some(
      (leg) => !leg.from || !leg.to || !leg.date
    );
    if (hasInvalidLeg) {
      errors.push("Please complete all multi-city flight details");
    }
  } else {
    switch (searchParams.dateSearchType) {
      case "specific":
        if (!searchParams.departDate) {
          errors.push("Please select a departure date");
        }
        if (tripType === "roundtrip" && !searchParams.returnDate) {
          errors.push("Please select a return date for round trip");
        }
        break;

      case "flexible-month":
        if (!searchParams.flexibleMonth || !searchParams.flexibleYear) {
          errors.push("Please select both month and year for flexible search");
        }
        break;

      case "flexible-days":
        if (searchParams.selectedDepartureDays?.length === 0) {
          errors.push("Please select at least one departure day");
        }
        if (
          tripType === "roundtrip" &&
          searchParams.selectedReturnDays?.length === 0
        ) {
          errors.push("Please select at least one return day");
        }
        break;

      case "duration":
        if (!searchParams.tripDuration) {
          errors.push("Please specify trip duration");
        }
        if (!searchParams.earliestDeparture) {
          errors.push("Please select earliest departure date");
        }
        break;
    }
  }

  return { isValid: errors.length === 0, errors };
};
