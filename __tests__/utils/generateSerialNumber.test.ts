import { generateSerialNumber } from '@/utils/generateSerialNumber';

jest.useFakeTimers().setSystemTime(new Date('2024-01-02T03:04:05Z'));

describe('generateSerialNumber', () => {
	test('returns deterministic serial format', () => {
		jest.spyOn(Math, 'random').mockReturnValue(0.1234);
		const value = generateSerialNumber();
		expect(value).toMatch(/^SN-\d{8}-\d{6}-\d{4}$/);
	});
});
