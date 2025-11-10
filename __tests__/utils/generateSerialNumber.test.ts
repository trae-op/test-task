import { generateSerialNumber } from '@/utils/generateSerialNumber';

describe('generateSerialNumber', () => {
	const realRandom = Math.random;
	const fixedDate = new Date(2025, 10, 3, 9, 7, 5);
	const deterministicRandom = () => 0.1234;

	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(fixedDate);
		Math.random = deterministicRandom;
	});

	afterAll(() => {
		jest.useRealTimers();
		Math.random = realRandom;
	});

	it('returns formatted serial string with date, time, and 4-digit random', () => {
		const sn = generateSerialNumber();
		expect(sn).toBe('SN-20251103-090705-1234');
	});

	it('pads random to 4 digits', () => {
		Math.random = () => 0;
		const sn = generateSerialNumber();
		const suffix = sn.split('-').pop();
		expect(suffix).toBe('0000');
	});
});
