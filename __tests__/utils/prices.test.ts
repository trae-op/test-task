import { findChangedPrices } from '@/utils/prices';

describe('findChangedPrices', () => {
	test('detects created, deleted and updated prices', () => {
		const foundPrices = [
			{ id: '1', symbol: 'USD', value: 10, isDefault: true },
			{ id: '2', symbol: 'EUR', value: 5, isDefault: false }
		];
		const newPrices = [
			{ symbol: 'USD', value: 20, isDefault: true },
			{ symbol: 'GBP', value: 7, isDefault: false }
		];
		const result = findChangedPrices({ foundPrices, newPrices });
		expect(result.toDelete).toEqual(['1', '2']);
		expect(result.toCreate).toEqual([
			{ symbol: 'USD', value: 20, isDefault: true },
			{ symbol: 'GBP', value: 7, isDefault: false }
		]);
		expect(result.hasChanges).toBe(true);
	});

	test('reports no changes when lists are equivalent', () => {
		const foundPrices = [
			{ id: '1', symbol: 'USD', value: 10, isDefault: true }
		];
		const newPrices = [{ symbol: 'USD', value: 10, isDefault: true }];
		const result = findChangedPrices({ foundPrices, newPrices });
		expect(result.toDelete).toEqual([]);
		expect(result.toCreate).toEqual([]);
		expect(result.hasChanges).toBe(false);
	});
});
