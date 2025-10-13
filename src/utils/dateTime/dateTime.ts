import type { TDateTimeFormat, TLocale } from "./types";

export const formatDateTime = (
  date: Date,
  locale: TLocale = "uk-UA"
): TDateTimeFormat => {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return {
    formattedDate,
    formattedTime,
  };
};
