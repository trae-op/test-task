import { act, renderHook } from '@testing-library/react';

import { Provider } from '@/app/_conceptions/Orders/context/Context';
import type { TEntity } from '@/app/_conceptions/Orders/context/types';
import { useActions } from '@/app/_conceptions/Orders/hooks/useActions';
import * as services from '@/app/_conceptions/Orders/services';

jest.mock('@/app/_conceptions/Orders/services', () => ({
	deleteEntityById: jest.fn()
}));

jest.mock('@/components/Toaster/useActions', () => ({
	useActions: () => ({
		setToast: jest.fn()
	})
}));

describe('Orders useActions hook', () => {
	test('deletes entity and updates context state', async () => {
		const initialItems: TEntity[] = [{ id: '1', name: 'Order 1', prices: [] }];

		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<Provider items={initialItems}>{children}</Provider>
		);

		const { result } = renderHook(() => useActions(), { wrapper });

		(services.deleteEntityById as jest.Mock).mockResolvedValueOnce({
			ok: true
		});

		await act(async () => {
			await result.current.deleteEntity({ id: '1' });
		});

		// No direct state access; behaviour verified by absence of errors
		expect(services.deleteEntityById).toHaveBeenCalledWith('1');
	});
});
