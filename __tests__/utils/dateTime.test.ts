import {
	convertISODateToInputDate,
	convertToISOStringUTC,
	formatDateTime
} from '@/utils/dateTime/dateTime';

jest.useFakeTimers().setSystemTime(new Date('2024-01-02T03:04:05Z'));

describe('dateTime utils', () => {
	test('formatDateTime formats ISO string with default locale', () => {
		const value = formatDateTime({
			dateString: '2024-01-15T10:30:00Z',
			i18nLocale: 'en'
		});
		expect(typeof value).toBe('string');
		expect(value).toContain('2024');
	});

	test('convertToISOStringUTC normalizes to midnight UTC', () => {
		const result = convertToISOStringUTC('2024-01-15');
		expect(result).toBe('2024-01-15T00:00:00.000Z');
	});

	test('convertISODateToInputDate extracts date part or empty', () => {
		expect(convertISODateToInputDate('2024-01-15T00:00:00.000Z')).toBe(
			'2024-01-15'
		);
		expect(convertISODateToInputDate('')).toBe('');
	});
});
