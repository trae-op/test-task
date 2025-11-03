import { act, renderHook } from '@testing-library/react';

import { useActions } from '@/hooks/getProducts';

// Mocks
const toastMock = jest.fn();
jest.mock('@/components/Toaster/useActions', () => ({
	useActions: () => ({ setToast: toastMock })
}));

const mockSetListLoading = jest.fn();
jest.mock('@/context/products/useContext', () => ({
	useSetListLoadingDispatch: () => mockSetListLoading
}));

const mockGetEntities = jest.fn();
jest.mock('@/services/products', () => ({
	getEntities: (...args: any[]) => mockGetEntities(...args)
}));

describe('getProducts/useActions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('calls service, forwards response to onSuccess, and toggles loading (success)', async () => {
		const response = { ok: true, data: { items: [{ id: '1' }] } } as any;
		mockGetEntities.mockResolvedValueOnce(response);

		const onSuccess = jest.fn();
		const { result } = renderHook(() => useActions());

		await act(async () => {
			await result.current.getAllEntities({ params: 'page=1', onSuccess });
		});

		expect(mockSetListLoading).toHaveBeenCalledWith(true);
		expect(mockGetEntities).toHaveBeenCalledWith('page=1');
		expect(onSuccess).toHaveBeenCalledWith(response);
		expect(mockSetListLoading).toHaveBeenLastCalledWith(false);
	});

	it('shows error toast and toggles loading on failure', async () => {
		mockGetEntities.mockRejectedValueOnce(new Error('network'));

		const { result } = renderHook(() => useActions());

		await act(async () => {
			await result.current.getAllEntities({ params: 'q=x' });
		});

		expect(mockSetListLoading).toHaveBeenCalledWith(true);
		expect(toastMock).toHaveBeenCalledWith('Error fetching entities', 'error');
		expect(mockSetListLoading).toHaveBeenLastCalledWith(false);
	});
});
