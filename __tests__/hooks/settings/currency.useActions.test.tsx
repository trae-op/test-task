import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useActions } from '@/hooks/settings/currency';

let formActionMock: jest.Mock<any, any>;
let useActionStateState: any;
jest.mock('react', () => {
	const actual = jest.requireActual('react');
	return {
		...actual,
		useActionState: (_fn: any, initial: any) => {
			formActionMock = jest.fn();
			return [useActionStateState ?? initial, formActionMock, false];
		},
		startTransition: (cb: any) => cb()
	};
});

jest.mock('@/actions/settings/currency', () => ({
	addCurrencySubmit: jest.fn()
}));

const toastMock = jest.fn();
jest.mock('@/components/Toaster/useActions', () => ({
	useActions: () => ({ setToast: toastMock })
}));

const mockSetAll = jest.fn();
const mockRemove = jest.fn();
const mockSetDeleteLoading = jest.fn();
jest.mock('@/context/currency/useContext', () => ({
	useListSelector: () => [],
	useSetAllDispatch: () => mockSetAll,
	useRemoveDispatch: () => mockRemove,
	useSetDeleteLoadingDispatch: () => mockSetDeleteLoading
}));

const mockDelete = jest.fn();
jest.mock('@/services/settings/currency', () => ({
	deleteEntityById: (...args: any[]) => mockDelete(...args)
}));

const Wrapper: React.FC<{
	children: React.ReactNode;
	capture?: (methods: any) => void;
}> = ({ children, capture }) => {
	const methods = useForm();
	capture?.(methods);
	return React.createElement(
		FormProvider as any,
		{ ...methods },
		children as any
	);
};

describe('hooks/settings/currency/useActions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useActionStateState = undefined;
	});

	it('onSubmit maps payload to FormData and dispatches action', () => {
		const { result } = renderHook(() => useActions(), { wrapper: Wrapper });

		act(() => {
			result.current.onSubmit({ title: 'US Dollar', value: 'USD' });
		});

		expect(formActionMock).toHaveBeenCalledTimes(1);
		const fd = formActionMock.mock.calls[0][0] as FormData;
		const map = new Map<string, string>();
		(fd as any).forEach?.((v: string, k: string) => map.set(k, v));
		expect(map.get('title')).toBe('US Dollar');
		expect(map.get('value')).toBe('USD');
	});

	it('deleteEntity toggles loading, calls service, updates context and onSuccess', async () => {
		mockDelete.mockResolvedValueOnce({ results: { ok: true } });
		const { result } = renderHook(() => useActions(), { wrapper: Wrapper });
		const onSuccess = jest.fn();

		await act(async () => {
			await result.current.deleteEntity({ id: 'c1', onSuccess });
		});

		expect(mockSetDeleteLoading).toHaveBeenCalledWith(true);
		expect(mockDelete).toHaveBeenCalledWith('c1');
		expect(mockRemove).toHaveBeenCalledWith('c1');
		expect(onSuccess).toHaveBeenCalled();
		expect(mockSetDeleteLoading).toHaveBeenLastCalledWith(false);
	});

	it('deleteEntity shows toast on error and toggles loading', async () => {
		mockDelete.mockRejectedValueOnce(new Error('boom'));
		const { result } = renderHook(() => useActions(), { wrapper: Wrapper });

		await act(async () => {
			await result.current.deleteEntity({ id: 'c2' });
		});

		expect(mockSetDeleteLoading).toHaveBeenCalledWith(true);
		expect(toastMock).toHaveBeenCalledWith('Error deleting entity', 'error');
		expect(mockSetDeleteLoading).toHaveBeenLastCalledWith(false);
	});

	it('when state.ok and item => appends to list and resets form', () => {
		let captured: any;
		useActionStateState = {
			ok: true,
			item: { id: 'n1', title: 'New', value: 'USD' }
		};
		renderHook(() => useActions(), {
			wrapper: (p: any) => <Wrapper {...p} capture={m => (captured = m)} />
		});

		expect(mockSetAll).toHaveBeenCalledWith([
			{ id: 'n1', title: 'New', value: 'USD' }
		]);
		expect(captured.reset).toBeInstanceOf(Function);
	});
});
