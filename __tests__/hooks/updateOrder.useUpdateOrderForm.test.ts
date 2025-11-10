import { act, renderHook } from '@testing-library/react';

import { useUpdateActions as useUpdateOrderForm } from '@/hooks/updateOrder/useUpdateActions';

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
	useParams: () => ({ id: 'o1' })
}));

const mockUseFormContext = jest.fn();
jest.mock('react-hook-form', () => ({
	useFormContext: () => mockUseFormContext()
}));

jest.mock('@/actions/updateOrder/action', () => ({ updateOrder: jest.fn() }));

const formDataToMap = (formData: FormData) => {
	const map = new Map<string, string>();
	(formData as any).forEach?.((value: string, key: string) =>
		map.set(key, value)
	);
	return map;
};

describe('updateOrder/useUpdateOrderForm', () => {
	beforeEach(() => jest.clearAllMocks());

	it('builds FormData on submit and exposes state props', () => {
		useActionStateState = { ok: false, message: 'Bad' };

		mockUseFormContext.mockReturnValue({
			watch: (key: string) =>
				key === 'productsSelected'
					? ([{ value: 'p1' }, { value: 'p2' }] as any)
					: undefined,
			formState: { isSubmitting: false, errors: {} }
		});

		const { result } = renderHook(() => useUpdateOrderForm());

		expect(result.current.error).toBe('Bad');

		act(() => {
			result.current.onSubmit({ orderId: '', title: 'Title' } as any);
		});

		expect(formActionMock).toHaveBeenCalledTimes(1);
		const fd = formActionMock.mock.calls[0][0] as FormData;
		const map = formDataToMap(fd);
		expect(map.get('orderId')).toBe('o1');
		expect(map.get('title')).toBe('Title');
		const products = JSON.parse(map.get('products') || '[]');
		expect(products).toEqual(['p1', 'p2']);
	});
});
