import type { Locale } from 'date-fns';

export type TDateFnsLocale = {
	locale: Locale;
};

export type TFormatDateParams = {
	dateString: string | Date;
	locale?: Locale;
	formatString?: string;
	i18nLocale?: string;
};
