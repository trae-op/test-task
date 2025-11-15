import { getFetch } from '@/utils/api';

import { deleteEntityById } from '@/app/_conceptions/Products/services';

jest.mock('@/utils/api', () => ({
	getFetch: jest.fn()
}));

describe('Products services api', () => {
	test('deleteEntityById calls getFetch with correct url and method', async () => {
		(getFetch as jest.Mock).mockResolvedValue({ ok: true });

		await deleteEntityById('123');

		expect(getFetch).toHaveBeenCalledWith('products?id=123', {
			method: 'DELETE'
		});
	});
});
