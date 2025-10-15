import { format, parseISO } from 'date-fns';
import { de, enUS, es, fr, pl, ru, uk } from 'date-fns/locale';

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
