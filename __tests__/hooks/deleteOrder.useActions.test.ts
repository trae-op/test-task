import { act, renderHook } from '@testing-library/react';

import { useActions } from '@/hooks/deleteOrder';

const toastMock = jest.fn();
jest.mock('@/components/Toaster/useActions', () => ({
	useActions: () => ({ setToast: toastMock })
}));

const mockRemove = jest.fn();
const mockSetDeleteLoading = jest.fn();
jest.mock('@/context/orders/useContext', () => ({
	useRemoveDispatch: () => mockRemove,
	useSetDeleteLoadingDispatch: () => mockSetDeleteLoading
}));

const mockDelete = jest.fn();
jest.mock('@/services/orders', () => ({
	deleteEntityById: (...args: any[]) => mockDelete(...args)
}));

describe('deleteOrder/useActions', () => {
	beforeEach(() => jest.clearAllMocks());

	it('deletes entity, updates context, calls onSuccess and toggles loading', async () => {
		mockDelete.mockResolvedValueOnce({ ok: true });
		const onSuccess = jest.fn();
		const { result } = renderHook(() => useActions());

		await act(async () => {
			await result.current.deleteEntity({ id: 'o1', onSuccess });
		});

		expect(mockSetDeleteLoading).toHaveBeenCalledWith(true);
		expect(mockDelete).toHaveBeenCalledWith('o1');
		expect(mockRemove).toHaveBeenCalledWith('o1');
		expect(onSuccess).toHaveBeenCalled();
		expect(mockSetDeleteLoading).toHaveBeenLastCalledWith(false);
	});

	it('shows toast on error and toggles loading', async () => {
		mockDelete.mockRejectedValueOnce(new Error('fail'));
		const { useActions: useToaster } = jest.requireMock(
			'@/components/Toaster/useActions'
		);
		const toaster = useToaster();

		const { result } = renderHook(() => useActions());
		await act(async () => {
			await result.current.deleteEntity({ id: 'o2' });
		});

		expect(mockSetDeleteLoading).toHaveBeenCalledWith(true);
		expect(toastMock).toHaveBeenCalledWith('Error deleting entity', 'error');
		expect(mockSetDeleteLoading).toHaveBeenLastCalledWith(false);
	});
});
