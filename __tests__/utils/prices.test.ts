import { findChangedPrices } from '@/utils/prices';

describe('findChangedPrices', () => {
	it('detects no changes', () => {
		const current = [
			{ id: '1', symbol: 'USD', value: 10, isDefault: true },
			{ id: '2', symbol: 'EUR', value: 20, isDefault: false }
		];
		const next = [
			{ symbol: 'USD', value: 10, isDefault: true },
			{ symbol: 'EUR', value: 20, isDefault: false }
		];
		const res = findChangedPrices({
			foundPrices: current as any,
			newPrices: next
		});
		expect(res).toEqual({ toDelete: [], toCreate: [], hasChanges: false });
	});

	it('detects value change as delete+create', () => {
		const current = [{ id: '1', symbol: 'USD', value: 10, isDefault: true }];
		const next = [{ symbol: 'USD', value: 15, isDefault: true }];
		const res = findChangedPrices({
			foundPrices: current as any,
			newPrices: next
		});
		expect(res.toDelete).toEqual(['1']);
		expect(res.toCreate).toEqual([
			{ symbol: 'USD', value: 15, isDefault: true }
		]);
		expect(res.hasChanges).toBe(true);
	});

	it('detects default flag change as delete+create', () => {
		const current = [{ id: '1', symbol: 'USD', value: 10, isDefault: false }];
		const next = [{ symbol: 'USD', value: 10, isDefault: true }];
		const res = findChangedPrices({
			foundPrices: current as any,
			newPrices: next
		});
		expect(res.toDelete).toEqual(['1']);
		expect(res.toCreate).toEqual([
			{ symbol: 'USD', value: 10, isDefault: true }
		]);
		expect(res.hasChanges).toBe(true);
	});

	it('detects addition and removal', () => {
		const current = [
			{ id: '1', symbol: 'USD', value: 10, isDefault: true },
			{ id: '2', symbol: 'EUR', value: 20, isDefault: false }
		];
		const next = [{ symbol: 'UAH', value: 40, isDefault: true }];
		const res = findChangedPrices({
			foundPrices: current as any,
			newPrices: next
		});
		expect(res.toDelete.sort()).toEqual(['1', '2']);
		expect(res.toCreate).toEqual([
			{ symbol: 'UAH', value: 40, isDefault: true }
		]);
		expect(res.hasChanges).toBe(true);
	});
});
