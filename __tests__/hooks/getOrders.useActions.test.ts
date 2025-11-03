import { act, renderHook } from '@testing-library/react';

import { useActions } from '@/hooks/getOrders';

const toastMock = jest.fn();
jest.mock('@/components/Toaster/useActions', () => ({
	useActions: () => ({ setToast: toastMock })
}));

const mockSetListLoading = jest.fn();
jest.mock('@/context/orders/useContext', () => ({
	useSetListLoadingDispatch: () => mockSetListLoading
}));

const mockGetEntities = jest.fn();
jest.mock('@/services/orders', () => ({
	getEntities: (...args: any[]) => mockGetEntities(...args)
}));

describe('getOrders/useActions', () => {
	beforeEach(() => jest.clearAllMocks());

	it('fetches orders, calls onSuccess, toggles loading on success', async () => {
		const response = { ok: true, data: { items: [{ id: 'o1' }] } } as any;
		mockGetEntities.mockResolvedValueOnce(response);

		const onSuccess = jest.fn();
		const { result } = renderHook(() => useActions());

		await act(async () => {
			await result.current.getAllEntities({ params: 'p=2', onSuccess });
		});

		expect(mockSetListLoading).toHaveBeenCalledWith(true);
		expect(mockGetEntities).toHaveBeenCalledWith('p=2');
		expect(onSuccess).toHaveBeenCalledWith(response);
		expect(mockSetListLoading).toHaveBeenLastCalledWith(false);
	});

	it('shows toast on error and toggles loading', async () => {
		mockGetEntities.mockRejectedValueOnce(new Error('boom'));
		const { result } = renderHook(() => useActions());
		await act(async () => {
			await result.current.getAllEntities({ params: '' });
		});

		expect(mockSetListLoading).toHaveBeenCalledWith(true);
		expect(toastMock).toHaveBeenCalledWith('Error fetching entities', 'error');
		expect(mockSetListLoading).toHaveBeenLastCalledWith(false);
	});
});
