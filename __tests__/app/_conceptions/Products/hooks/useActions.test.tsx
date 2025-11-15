import { act, renderHook } from '@testing-library/react';

import { useActions } from '@/app/_conceptions/Products/hooks/useActions';
import { deleteEntityById } from '@/app/_conceptions/Products/services';

const setToastMock = jest.fn();
const removeDispatchMock = jest.fn();
const setDeleteLoadingMock = jest.fn();

jest.mock('@/components/Toaster/useActions', () => ({
	useActions: () => ({
		setToast: setToastMock
	})
}));

jest.mock('@/app/_conceptions/Products/services', () => ({
	deleteEntityById: jest.fn()
}));

jest.mock('@/app/_conceptions/Products/context/useContext', () => ({
	useRemoveDispatch: () => removeDispatchMock,
	useSetDeleteLoadingDispatch: () => setDeleteLoadingMock
}));

describe('useActions hook for Products', () => {
	test('calls deleteEntityById and onSuccess on success', async () => {
		(deleteEntityById as jest.Mock).mockResolvedValueOnce(undefined);

		const { result } = renderHook(() => useActions());

		const onSuccess = jest.fn();

		await act(async () => {
			await result.current.deleteEntity({ id: '1', onSuccess });
		});

		expect(deleteEntityById).toHaveBeenCalledWith('1');
		expect(onSuccess).toHaveBeenCalled();
	});

	test('handles non-Response error by showing generic toast', async () => {
		(deleteEntityById as jest.Mock).mockRejectedValueOnce(new Error('fail'));

		const { result } = renderHook(() => useActions());

		await act(async () => {
			await result.current.deleteEntity({ id: '1' });
		});

		expect(setToastMock).toHaveBeenCalledWith(
			'Something wrong with the server!',
			'error'
		);
	});
});
