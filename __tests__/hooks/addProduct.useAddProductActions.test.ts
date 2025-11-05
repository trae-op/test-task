import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useAddProductActions } from '@/hooks/addProduct/useActions';

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
jest.mock('@/actions/addProduct/submit', () => ({
	addProductSubmit: jest.fn()
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const methods = useForm({
		defaultValues: {
			prices: [
				{ value: 'USD', label: '10 USD', valueAmount: 10, isDefault: true },
				{ value: 'EUR', label: '20 EUR', valueAmount: 20 }
			]
		}
	} as any);
	return React.createElement(
		FormProvider as any,
		{ ...methods },
		children as any
	);
};

describe('addProduct/useAddProductActions', () => {
	it('maps form data and watched prices to FormData and dispatches', () => {
		useActionStateState = { ok: false };
		const { result } = renderHook(() => useAddProductActions(), {
			wrapper: Wrapper
		});

		act(() => {
			result.current.onAddProductSubmit({
				title: 'Laptop',
				serialNumber: 'SN-1',
				type: 'hw',
				specification: 'spec',
				guaranteeStart: '2024-01-01',
				guaranteeEnd: '2024-12-31'
			} as any);
		});

		expect(formActionMock).toHaveBeenCalledTimes(1);
		const fd = formActionMock.mock.calls[0][0] as FormData;
		const map = new Map<string, string>();
		(fd as any).forEach?.((v: string, k: string) => map.set(k, v));
		expect(map.get('title')).toBe('Laptop');
		expect(map.get('serialNumber')).toBe('SN-1');
		expect(map.get('type')).toBe('hw');
		expect(map.get('specification')).toBe('spec');
		expect(map.get('guaranteeStart')).toBe('2024-01-01');
		expect(map.get('guaranteeEnd')).toBe('2024-12-31');
		const prices = JSON.parse(map.get('prices') || '[]');
		expect(prices).toEqual([
			{ symbol: 'USD', value: 10, isDefault: true },
			{ symbol: 'EUR', value: 20, isDefault: false }
		]);
	});
});
