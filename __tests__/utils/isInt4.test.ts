import { isInt4 } from '@/utils/isInt4';

describe('isInt4', () => {
	it('accepts int4 boundaries', () => {
		expect(isInt4(-2147483648)).toBe(true);
		expect(isInt4(2147483647)).toBe(true);
	});

	it('rejects out-of-range ints', () => {
		expect(isInt4(-2147483649)).toBe(false);
		expect(isInt4(2147483648)).toBe(false);
	});

	it('rejects non-integers and non-numbers', () => {
		expect(isInt4(1.5)).toBe(false);
		expect(isInt4(NaN)).toBe(false);
		expect(isInt4('123' as unknown)).toBe(false);
		expect(isInt4(null as unknown)).toBe(false);
		expect(isInt4(undefined as unknown)).toBe(false);
	});
});
