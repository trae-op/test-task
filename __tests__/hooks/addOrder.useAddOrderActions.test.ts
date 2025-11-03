import { act, renderHook } from '@testing-library/react';

import { useAddOrderActions } from '@/hooks/addOrder/useAddOrderActions';

// Mock React hooks to control useActionState and startTransition behavior
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

// avoid importing server action internals
jest.mock('@/actions/addOrder/submit', () => ({ addOrderSubmit: jest.fn() }));

describe('addOrder/useAddOrderActions', () => {
	it('maps form data and product ids to FormData and dispatches', () => {
		useActionStateState = { ok: false };
		const { result } = renderHook(() => useAddOrderActions());

		act(() => {
			result.current.onAddOrderSubmit(
				{ title: 'Order 1', description: 'Desc' },
				[
					{ value: 'p1', label: 'p1' },
					{ value: 'p2', label: 'p2' }
				] as any,
				'en'
			);
		});

		expect(formActionMock).toHaveBeenCalledTimes(1);
		const fd = formActionMock.mock.calls[0][0] as FormData;
		const map = new Map<string, string>();
		// FormData iteration in jsdom
		(fd as any).forEach?.((v: string, k: string) => map.set(k, v));
		expect(map.get('title')).toBe('Order 1');
		expect(map.get('description')).toBe('Desc');
		expect(map.get('locale')).toBe('en');
		const products = JSON.parse(map.get('products') || '[]');
		expect(products).toEqual(['p1', 'p2']);
	});
});
