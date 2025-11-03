import { act, renderHook } from '@testing-library/react';

import { useUpdateActions } from '@/hooks/updateProduct/useActions';

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

jest.mock('next/navigation', () => ({
	useParams: () => ({ id: 'p1' })
}));

const mockUseFormContext = jest.fn();
jest.mock('react-hook-form', () => ({
	useFormContext: () => mockUseFormContext()
}));

// avoid importing server action internals
jest.mock('@/actions/updateProduct', () => ({ updateProduct: jest.fn() }));

describe('updateProduct/useActions', () => {
	beforeEach(() => jest.clearAllMocks());

	it('maps update data and prices to FormData and dispatches', () => {
		useActionStateState = { ok: false };

		mockUseFormContext.mockReturnValue({
			watch: (key: string) =>
				key === 'prices'
					? [
							{ value: 'USD', valueAmount: 10, isDefault: true },
							{ value: 'EUR', valueAmount: 20 }
						]
					: undefined
		});

		const { result } = renderHook(() => useUpdateActions());

		act(() => {
			result.current.onUpdateSubmit({
				title: 'New',
				isNew: true,
				serialNumber: 'SN',
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
		expect(map.get('id')).toBe('p1');
		expect(map.get('title')).toBe('New');
		expect(map.get('isNew')).toBe('true');
		expect(map.get('serialNumber')).toBe('SN');
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
