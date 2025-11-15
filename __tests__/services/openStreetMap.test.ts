import { reverseGeocode, searchLocation } from '@/services/openStreetMap';

const originalFetch = global.fetch;

const mockResponse = (data: unknown, ok = true, status = 200) =>
	Promise.resolve({
		ok,
		status,
		json: () => Promise.resolve(data)
	} as Response);

afterEach(() => {
	global.fetch = originalFetch;
	jest.resetAllMocks();
});

describe('openStreetMap service', () => {
	test('searchLocation returns null for empty or whitespace query', async () => {
		global.fetch = jest.fn();
		await expect(searchLocation({ query: '' })).resolves.toBeNull();
		await expect(searchLocation({ query: '   ' })).resolves.toBeNull();
		expect(global.fetch).not.toHaveBeenCalled();
	});

	test('searchLocation maps first result to location details', async () => {
		global.fetch = jest.fn().mockImplementation(() =>
			mockResponse([
				{
					lat: '50.1',
					lon: '30.2',
					display_name: ' Test Place ',
					address: {
						country: 'Country',
						state: 'State',
						city: 'City',
						city_district: 'District',
						road: 'Street',
						postcode: '12345'
					}
				}
			])
		);

		const result = await searchLocation({ query: 'Test' });
		expect(result).not.toBeNull();
		expect(result?.lat).toBeCloseTo(50.1);
		expect(result?.lng).toBeCloseTo(30.2);
		expect(result?.displayName).toBe('Test Place');
		expect(result?.city).toBe('City');
		expect(result?.district).toBe('District');
		expect(result?.street).toBe('Street');
	});

	test('searchLocation returns null when API returns empty array', async () => {
		global.fetch = jest.fn().mockImplementation(() => mockResponse([]));
		const result = await searchLocation({ query: 'Nothing' });
		expect(result).toBeNull();
	});

	test('reverseGeocode maps result to location details', async () => {
		global.fetch = jest.fn().mockImplementation(() =>
			mockResponse({
				lat: '51.5',
				lon: '-0.12',
				display_name: ' Place ',
				address: {
					country: 'UK',
					state: 'England',
					city: 'London',
					suburb: 'Suburb',
					road: 'Road',
					postcode: 'SW1A 1AA'
				}
			})
		);

		const result = await reverseGeocode({ lat: 51.5, lng: -0.12 });
		expect(result).not.toBeNull();
		expect(result?.lat).toBeCloseTo(51.5);
		expect(result?.lng).toBeCloseTo(-0.12);
		expect(result?.country).toBe('UK');
		expect(result?.city).toBe('London');
		expect(result?.street).toBe('Road');
	});

	test('reverseGeocode throws on non-ok response', async () => {
		global.fetch = jest
			.fn()
			.mockImplementation(() => mockResponse({}, false, 500));
		await expect(reverseGeocode({ lat: 0, lng: 0 })).rejects.toThrow(
			/OpenStreetMap request failed with status 500/
		);
	});
});
