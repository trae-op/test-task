import { act, renderHook } from '@testing-library/react';
import toast from 'react-hot-toast';

import { useActions } from '@/components/Toaster/useActions';

jest.mock('react-hot-toast', () => ({
	__esModule: true,
	default: {
		success: jest.fn(),
		error: jest.fn()
	}
}));

describe('components/Toaster/useActions', () => {
	it('calls toast.success by default', () => {
		const { result } = renderHook(() => useActions());
		act(() => {
			result.current.setToast('Saved');
		});
		expect((toast as any).success).toHaveBeenCalledWith('Saved', undefined);
	});

	it('calls toast.error when type is error', () => {
		const { result } = renderHook(() => useActions());
		act(() => {
			result.current.setToast('Failed', 'error');
		});
		expect((toast as any).error).toHaveBeenCalledWith('Failed', undefined);
	});
});
