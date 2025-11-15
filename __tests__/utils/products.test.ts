import { findChangedProducts, getPicturesByProducts } from '@/utils/products';

jest.mock('@/utils/upload-files', () => ({
	getFullPathUploadPicture: jest.fn(({ url }: { url: string }) => `${url}-mini`)
}));

describe('findChangedProducts', () => {
	test('detects products to connect and disconnect', () => {
		const foundProducts = [{ id: '1' }, { id: '2' }];
		const newProductIds = ['2', '3'];
		const result = findChangedProducts({ foundProducts, newProductIds });
		expect(result.toDisconnect).toEqual(['1']);
		expect(result.toConnect).toEqual(['3']);
		expect(result.hasChanges).toBe(true);
	});

	test('reports no changes for same products', () => {
		const foundProducts = [{ id: '1' }];
		const newProductIds = ['1'];
		const result = findChangedProducts({ foundProducts, newProductIds });
		expect(result.toDisconnect).toEqual([]);
		expect(result.toConnect).toEqual([]);
		expect(result.hasChanges).toBe(false);
	});
});

describe('getPicturesByProducts', () => {
	test('returns null when no items', () => {
		const selector = getPicturesByProducts({ ok: false, code: 'ERR' });
		expect(selector('1')).toBeNull();
	});

	test('returns mini picture url when available', () => {
		const selector = getPicturesByProducts({
			ok: true,
			items: [
				{
					id: '1',
					createdAt: new Date(),
					userId: 'u',
					productId: 'p1',
					url: 'http://example.com/img.jpg',
					pictureId: 'pic'
				}
			]
		});
		const value = selector('p1');
		expect(value).toBe('http://example.com/img.jpg-mini');
	});
});
