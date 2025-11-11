import type { TPickupLocation } from '@/types/pickupLocation';

import {
	formatLocationLabel,
	isSameLocation,
	toLocationFormValue
} from '@/utils/map';

describe('utils/map', () => {
	const createPickupLocation = (
		overrides?: Partial<TPickupLocation>
	): TPickupLocation => ({
		id: 'loc-1',
		latitude: 50.123456,
		longitude: 30.654321,
		country: 'Ukraine',
		state: 'Kyiv',
		city: 'Kyiv',
		district: 'Shevchenkivskyi',
		street: 'Khreshchatyk',
		postcode: '01001',
		displayName: 'Kyiv, Ukraine',
		userId: 'user-1',
		...overrides
	});

	describe('formatLocationLabel', () => {
		it('prefers displayName when present', () => {
			const label = formatLocationLabel({
				lat: 50.123456,
				lng: 30.654321,
				displayName: 'Kyiv, Ukraine'
			});
			expect(label).toBe('Kyiv, Ukraine');
		});

		it('builds label from available parts', () => {
			const label = formatLocationLabel({
				lat: 50.123456,
				lng: 30.654321,
				street: 'Khreshchatyk',
				city: 'Kyiv',
				district: undefined,
				country: 'Ukraine'
			});
			expect(label).toBe('Khreshchatyk, Kyiv, Ukraine');
		});

		it('falls back to coordinates when no parts available', () => {
			const label = formatLocationLabel({
				lat: 50.1234567,
				lng: 30.9876543
			});
			expect(label).toBe('50.12346, 30.98765');
		});
	});

	describe('toLocationFormValue', () => {
		it('normalizes pickup location entity to form value', () => {
			const entity = createPickupLocation({
				country: null,
				state: null,
				city: 'Kyiv',
				displayName: null
			});

			const value = toLocationFormValue(entity);

			expect(value).toEqual({
				lat: 50.123456,
				lng: 30.654321,
				country: undefined,
				state: undefined,
				city: 'Kyiv',
				district: 'Shevchenkivskyi',
				street: 'Khreshchatyk',
				postcode: '01001',
				displayName: undefined
			});
		});
	});

	describe('isSameLocation', () => {
		it('returns false when either value undefined', () => {
			expect(isSameLocation(undefined, { lat: 1, lng: 1 })).toBe(false);
			expect(isSameLocation({ lat: 1, lng: 1 }, undefined)).toBe(false);
		});

		it('returns true for coordinates within tolerance', () => {
			expect(
				isSameLocation({ lat: 1, lng: 1 }, { lat: 1 + 5e-7, lng: 1 - 5e-7 })
			).toBe(true);
		});

		it('returns false when coordinates differ beyond tolerance', () => {
			expect(isSameLocation({ lat: 1, lng: 1 }, { lat: 1.00001, lng: 1 })).toBe(
				false
			);
		});
	});
});
