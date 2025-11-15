import { isInt4 } from '@/utils/isInt4';

describe('isInt4', () => {
	test('accepts valid 32-bit integers', () => {
		expect(isInt4(0)).toBe(true);
		expect(isInt4(2147483647)).toBe(true);
		expect(isInt4(-2147483648)).toBe(true);
	});

	test('rejects non-integers or out of range', () => {
		expect(isInt4(2147483648)).toBe(false);
		expect(isInt4(-2147483649)).toBe(false);
		expect(isInt4(1.5)).toBe(false);
		expect(isInt4('1')).toBe(false);
	});
});
