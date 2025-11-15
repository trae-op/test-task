import { getFetch } from '@/utils/api';

import { deleteEntityById } from '@/app/_conceptions/Orders/services/api';

jest.mock('@/utils/api', () => ({
	getFetch: jest.fn()
}));

describe('Orders services api', () => {
	test('deleteEntityById calls getFetch with correct arguments', async () => {
		await deleteEntityById('123');

		expect(getFetch).toHaveBeenCalledWith('orders?id=123', {
			method: 'DELETE'
		});
	});
});
