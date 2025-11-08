import { reverseGeocode, searchLocation } from '@/services/openStreetMap';

describe('openStreetMap service', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		jest.resetAllMocks();
		global.fetch = originalFetch;
	});

	it('should return null and skip fetch for empty query', async () => {
		const fetchSpy = jest.fn();
		global.fetch = fetchSpy as unknown as typeof fetch;

		const result = await searchLocation({ query: '   ' });

		expect(result).toBeNull();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('should return normalized location details on search', async () => {
		const response = {
			ok: true,
			json: async () => [
				{
					lat: '50.4501',
					lon: '30.5234',
					display_name: 'Kyiv, Ukraine',
					address: {
						country: 'Ukraine',
						state: 'Kyiv City',
						city: 'Kyiv',
						city_district: 'Shevchenkivskyi District',
						road: 'Khreshchatyk Street',
						postcode: '01001'
					}
				}
			]
		};

		const fetchSpy = jest.fn().mockResolvedValue(response);
		global.fetch = fetchSpy as unknown as typeof fetch;

		const result = await searchLocation({ query: 'Kyiv' });

		expect(fetchSpy).toHaveBeenCalledWith(
			expect.stringContaining('https://nominatim.openstreetmap.org/search'),
			expect.objectContaining({ method: 'GET' })
		);
		expect(result).toEqual({
			lat: 50.4501,
			lng: 30.5234,
			country: 'Ukraine',
			state: 'Kyiv City',
			city: 'Kyiv',
			district: 'Shevchenkivskyi District',
			street: 'Khreshchatyk Street',
			postcode: '01001',
			displayName: 'Kyiv, Ukraine'
		});
	});

	it('should normalize coordinates on reverse geocode', async () => {
		const response = {
			ok: true,
			json: async () => ({
				lat: '49.8383',
				lon: '24.0232',
				address: {
					country: 'Ukraine',
					state: 'Lviv Oblast',
					city: 'Lviv'
				}
			})
		};

		const fetchSpy = jest.fn().mockResolvedValue(response);
		global.fetch = fetchSpy as unknown as typeof fetch;

		const result = await reverseGeocode({ lat: 49.8383, lng: 24.0232 });

		expect(fetchSpy).toHaveBeenCalledWith(
			expect.stringContaining('https://nominatim.openstreetmap.org/reverse'),
			expect.objectContaining({ method: 'GET' })
		);
		expect(result).toEqual({
			lat: 49.8383,
			lng: 24.0232,
			country: 'Ukraine',
			state: 'Lviv Oblast',
			city: 'Lviv',
			district: undefined,
			street: undefined,
			postcode: undefined,
			displayName: undefined
		});
	});

	it('should throw when response is not ok', async () => {
		const response = { ok: false, status: 500 };
		const fetchSpy = jest.fn().mockResolvedValue(response);
		global.fetch = fetchSpy as unknown as typeof fetch;

		await expect(searchLocation({ query: 'Kyiv' })).rejects.toThrow(
			/OpenStreetMap request failed/
		);
	});
});
