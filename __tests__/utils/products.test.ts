import { findChangedProducts } from '@/utils/products';

describe('findChangedProducts', () => {
	it('detects connects only', () => {
		const res = findChangedProducts({
			foundProducts: [],
			newProductIds: ['a', 'b']
		});
		expect(res).toEqual({
			toDisconnect: [],
			toConnect: ['a', 'b'],
			hasChanges: true
		});
	});

	it('detects disconnects only', () => {
		const res = findChangedProducts({
			foundProducts: [{ id: '1' }, { id: '2' }] as any,
			newProductIds: []
		});
		expect(res).toEqual({
			toDisconnect: ['1', '2'],
			toConnect: [],
			hasChanges: true
		});
	});

	it('no changes when sets are equal', () => {
		const res = findChangedProducts({
			foundProducts: [{ id: '1' }, { id: '2' }] as any,
			newProductIds: ['2', '1']
		});
		expect(res).toEqual({ toDisconnect: [], toConnect: [], hasChanges: false });
	});
});
