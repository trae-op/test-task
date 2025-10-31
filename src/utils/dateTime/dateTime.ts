import { format, parseISO } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';

import { TFormatDateParams } from './types';

const DEFAULT_FORMAT = 'dd MMMM yyyy HH:mm';

const mapI18nToDateFns = (code?: string) => {
	switch (code?.toLowerCase()) {
		case 'uk':
		case 'uk-ua':
			return uk;
		case 'en':
		case 'en-us':
		default:
			return enUS;
	}
};

export const formatDateTime = (params: TFormatDateParams): string => {
	const { dateString, locale, formatString, i18nLocale } = params;

	const effectiveLocale = locale ?? mapI18nToDateFns(i18nLocale);

	const dateToFormat =
		typeof dateString === 'string' ? parseISO(dateString) : dateString;

	const finalFormat = formatString ?? DEFAULT_FORMAT;

	return format(dateToFormat, finalFormat, { locale: effectiveLocale });
};

export const convertToISOStringUTC = (dateString: string): string => {
	const utcString = `${dateString}T00:00:00.000Z`;
	return new Date(utcString).toISOString();
};

export const convertISODateToInputDate = (isoString: string): string => {
	if (!isoString) return '';
	return isoString.substring(0, 10);
};
