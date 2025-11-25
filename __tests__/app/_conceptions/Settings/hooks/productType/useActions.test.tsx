import { act, renderHook } from '@testing-library/react';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import {
	addProductTypeSubmit,
	deleteProductType
} from '@/app/_conceptions/Settings/actions/productType';
import {
	useListSelector,
	useSetAllDispatch
} from '@/app/_conceptions/Settings/context/productType/useSelectors';
import { useActions } from '@/app/_conceptions/Settings/hooks/productType';

jest.mock('react', () => {
	const actual = jest.requireActual('react');
	return {
		...actual,
		useActionState: jest.fn(),
		startTransition: jest.fn((callback: () => void) => callback())
	};
});

jest.mock('react-hook-form', () => ({
	useFormContext: jest.fn()
}));

jest.mock('@/app/_conceptions/Settings/context/productType/useContext', () => ({
	useListSelector: jest.fn(),
	useSetAllDispatch: jest.fn()
}));

jest.mock('@/app/_conceptions/Settings/actions/productType', () => ({
	addProductTypeSubmit: jest.fn(),
	deleteProductType: jest.fn()
}));

const mockFormContext = useFormContext as unknown as jest.Mock;
const mockUseActionState = React.useActionState as unknown as jest.Mock;
const mockStartTransition = React.startTransition as unknown as jest.Mock;

const setAllMock = jest.fn();
const formActionMock = jest.fn();
const deleteFormActionMock = jest.fn();

const mockList = [{ id: 'pt-1', title: 'Device', value: 'device' }];

type TMockState = {
	ok: boolean;
	item?: { id: string; title: string; value: string };
};

const setupHook = () => {
	const addState: TMockState = { ok: false };
	mockUseActionState.mockReset();
	mockUseActionState.mockImplementation(handler => {
		if (handler === addProductTypeSubmit) {
			return [addState, formActionMock];
		}

		return [{ ok: false }, deleteFormActionMock];
	});
	(useListSelector as jest.Mock).mockReturnValue(mockList);
	(useSetAllDispatch as jest.Mock).mockReturnValue(setAllMock);
	const resetMock = jest.fn();
	mockFormContext.mockReturnValue({ reset: resetMock });
	return { addState, resetMock };
};

describe('useActions (product type)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		setAllMock.mockClear();
		formActionMock.mockClear();
		deleteFormActionMock.mockClear();
	});

	describe('positive cases', () => {
		test('sends form payload via transition', () => {
			setupHook();
			const { result } = renderHook(() => useActions());

			act(() => {
				result.current.onSubmit({ title: 'Accessory', value: 'accessory' });
			});

			expect(mockStartTransition).toHaveBeenCalled();
			const fd = formActionMock.mock.calls[0][0] as FormData;
			expect(fd.get('title')).toBe('Accessory');
			expect(fd.get('value')).toBe('accessory');
		});
	});

	describe('negative cases', () => {
		test('deleteEntity forwards id through FormData', () => {
			setupHook();
			const { result } = renderHook(() => useActions());

			act(() => {
				result.current.deleteEntity('pt-9');
			});

			const fd = deleteFormActionMock.mock.calls[0][0] as FormData;
			expect(fd.get('id')).toBe('pt-9');
		});
	});

	describe('edge cases', () => {
		test('appends created entity and resets form', () => {
			const { addState, resetMock } = setupHook();
			const { rerender } = renderHook(() => useActions());

			addState.ok = true;
			addState.item = { id: 'pt-2', title: 'Gadget', value: 'gadget' };

			rerender();

			expect(setAllMock).toHaveBeenCalledWith([
				...mockList,
				{ id: 'pt-2', title: 'Gadget', value: 'gadget' }
			]);
			expect(resetMock).toHaveBeenCalled();
		});
	});
});
