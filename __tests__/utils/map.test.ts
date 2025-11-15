import {
	formatLocationLabel,
	isSameLocation,
	toLocationFormValue
} from '@/utils/map';

const baseLocation = {
	lat: 50.123456,
	lng: 30.654321,
	country: 'Country',
	state: 'State',
	city: 'City',
	district: 'District',
	street: 'Street',
	postcode: '12345',
	displayName: 'Display Name'
};

describe('map utils', () => {
	test('formatLocationLabel prefers displayName', () => {
		const label = formatLocationLabel(baseLocation);
		expect(label).toBe('Display Name');
	});

	test('formatLocationLabel falls back to address parts', () => {
		const label = formatLocationLabel({ ...baseLocation, displayName: '' });
		expect(label).toBe('Street, City, District, Country');
	});

	test('formatLocationLabel falls back to coordinates', () => {
		const label = formatLocationLabel({
			lat: 50.1,
			lng: 30.2,
			country: undefined,
			state: undefined,
			city: undefined,
			district: undefined,
			street: undefined,
			postcode: undefined,
			displayName: ''
		});
		expect(label).toBe('50.10000, 30.20000');
	});

	test('toLocationFormValue maps pickup location', () => {
		const pickup = {
			id: 'id-1',
			userId: 'user-1',
			latitude: 1,
			longitude: 2,
			country: 'C',
			state: 'S',
			city: 'City',
			district: 'D',
			street: 'St',
			postcode: 'P',
			displayName: 'Name'
		};
		const result = toLocationFormValue(pickup);
		expect(result.lat).toBe(1);
		expect(result.lng).toBe(2);
		expect(result.displayName).toBe('Name');
	});

	test('isSameLocation compares coordinates with tolerance', () => {
		const left = { ...baseLocation };
		const right = { ...baseLocation, lat: baseLocation.lat + 5e-7 };
		expect(isSameLocation(left, right)).toBe(true);
		expect(
			isSameLocation(left, { ...right, lat: baseLocation.lat + 1e-4 })
		).toBe(false);
		expect(isSameLocation(undefined, right)).toBe(false);
	});
});
