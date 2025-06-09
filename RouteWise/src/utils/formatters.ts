export const formatDate = (date: string | undefined): string => {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(date));
  } catch {
    return date;
  }
};

export const parseDate = (value: string): Date | null => {
  return value ? new Date(`${value}T00:00:00`) : null;
};

export const getDurationMinutes = (duration: string): number => {
  const match = duration.match(/(\d+)h\s*(\d+)m/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return 0;
};

export const getStopsCount = (stops: string): number => {
  if (stops === "Direct") return 0;
  if (stops === "1 stop") return 1;
  return 2;
};
