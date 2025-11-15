import { act, renderHook } from '@testing-library/react';
import { useParams } from 'next/navigation';
import * as React from 'react';

import type { OptionType } from '@/components/MultiSelectField/types';

import { useAddActions } from '@/app/_conceptions/AddOrder/hooks/useAddActions';

jest.mock('react', () => {
	const actual = jest.requireActual('react');
	return {
		...actual,
		useActionState: jest.fn(),
		startTransition: jest.fn()
	};
});

jest.mock('next/navigation', () => ({
	useParams: jest.fn()
}));

jest.mock('@/app/_conceptions/AddOrder/actions/submit', () => ({
	addOrderSubmit: jest.fn()
}));

jest.mock('@/app/_conceptions/AddOrder/actions/submit', () => ({
	addOrderSubmit: jest.fn()
}));

describe('useAddActions hook', () => {
	const formActionMock = jest.fn();
	const mockUseActionState = React.useActionState as unknown as jest.Mock;
	const mockStartTransition = React.startTransition as unknown as jest.Mock;

	beforeEach(() => {
		mockUseActionState.mockReturnValue([
			{ ok: false, message: 'err-key' },
			formActionMock
		]);
		mockStartTransition.mockImplementation((callback: () => void) =>
			callback()
		);
		(useParams as jest.Mock).mockReturnValue({ locale: 'en' });
		formActionMock.mockReset();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('exposes error from state and forwards submission data', () => {
		const { result } = renderHook(() => useAddActions());

		expect(result.current.error).toBe('err-key');

		const payload: OptionType[] = [{ value: '1', label: 'One' }];

		act(() => {
			result.current.onAddOrderSubmit(
				{ title: 'Order', description: 'Desc' },
				payload
			);
		});

		expect(mockStartTransition).toHaveBeenCalled();
		expect(formActionMock).toHaveBeenCalledTimes(1);

		const fd = formActionMock.mock.calls[0][0] as FormData;
		expect(fd.get('title')).toBe('Order');
		expect(fd.get('description')).toBe('Desc');
		expect(fd.get('products')).toBe(JSON.stringify(['1']));
		expect(fd.get('locale')).toBe('en');
	});

	test('handles optional description and missing locale', () => {
		(useParams as jest.Mock).mockReturnValueOnce({});
		const { result } = renderHook(() => useAddActions());

		act(() => {
			result.current.onAddOrderSubmit({ title: 'Order', description: '' }, []);
		});

		const fd = formActionMock.mock.calls[0][0] as FormData;
		expect(fd.get('description')).toBeNull();
		expect(fd.get('locale')).toBe('');
	});
});
