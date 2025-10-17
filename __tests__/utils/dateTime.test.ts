import { formatDateTime } from '@/utils/dateTime';

describe('utils/dateTime: formatDateTime', () => {
	it('formats ISO string with i18n locale (en default)', () => {
		const iso = '2025-10-17T14:35:00.000Z';
		const out = formatDateTime({
			dateString: iso,
			formatString: 'yyyy-MM-dd HH:mm',
			i18nLocale: 'en-US'
		});
		expect(out).toMatch(/2025-10-17 \d{2}:\d{2}/);
	});

	it('formats Date with uk locale', () => {
		const d = new Date('2025-10-17T14:35:00.000Z');
		const out = formatDateTime({
			dateString: d,
			formatString: 'dd MMM yyyy',
			i18nLocale: 'uk'
		});
		expect(out).toMatch(/17 .* 2025/);
	});

	it('uses default format when formatString is not provided', () => {
		const d = new Date('2025-10-17T14:35:00.000Z');
		const out = formatDateTime({ dateString: d });
		expect(typeof out).toBe('string');
		expect(out.length).toBeGreaterThan(0);
	});
});
