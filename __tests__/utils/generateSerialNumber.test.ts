import { generateSerialNumber } from '@/utils/generateSerialNumber';

describe('generateSerialNumber', () => {
	const realDate = Date;
	const realRandom = Math.random;

	beforeAll(() => {
		// Freeze time: 2025-11-03 09:07:05
		// Months are 0-based in JS Date
		jest.useFakeTimers();
		jest.setSystemTime(new Date(2025, 10, 3, 9, 7, 5));
		// Deterministic random
		Math.random = () => 0.1234; // -> 1234 after * 10000
	});

	afterAll(() => {
		jest.useRealTimers();
		Math.random = realRandom;
		// Restore Date automatically by useRealTimers
		// but keep reference for clarity
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const _ = realDate;
	});

	it('returns formatted serial string with date, time, and 4-digit random', () => {
		const sn = generateSerialNumber();
		expect(sn).toBe('SN-20251103-090705-1234');
	});

	it('pads random to 4 digits', () => {
		// Use a stable edge-case value to avoid FP rounding issues
		Math.random = () => 0; // -> 0 -> "0000"
		const sn = generateSerialNumber();
		const suffix = sn.split('-').pop();
		expect(suffix).toBe('0000');
	});
});
