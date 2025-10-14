import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { TFormatDateParams } from "./types";
import { Locale } from "date-fns";

const DEFAULT_FORMAT = "dd MMMM yyyy HH:mm";

export const formatDateTime = (params: TFormatDateParams): string => {
  const { dateString, locale = enUS, formatString } = params;

  const dateToFormat =
    typeof dateString === "string" ? parseISO(dateString) : dateString;

  const finalFormat = formatString ?? DEFAULT_FORMAT;

  return format(dateToFormat, finalFormat, { locale });
};
