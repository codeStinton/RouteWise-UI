export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const DAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export const TIME_PERIODS = [
  {
    label: "Early Morning",
    time: "6AM - 12PM",
    icon: "🌅",
    hourRange: [6, 12],
  },
  { label: "Afternoon", time: "12PM - 6PM", icon: "☀️", hourRange: [12, 18] },
  { label: "Evening", time: "6PM - 12AM", icon: "🌆", hourRange: [18, 24] },
  { label: "Night", time: "12AM - 6AM", icon: "🌙", hourRange: [0, 6] },
];
