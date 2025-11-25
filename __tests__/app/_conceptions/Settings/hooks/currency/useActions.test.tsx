import { act, renderHook } from '@testing-library/react';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import {
	addCurrencySubmit,
	deleteCurrency
} from '@/app/_conceptions/Settings/actions/currency';
import {
	useListSelector,
	useSetAllDispatch
} from '@/app/_conceptions/Settings/context/currency/useSelectors';
import { useActions } from '@/app/_conceptions/Settings/hooks/currency';

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

jest.mock('@/app/_conceptions/Settings/context/currency/useContext', () => ({
	useListSelector: jest.fn(),
	useSetAllDispatch: jest.fn()
}));

jest.mock('@/app/_conceptions/Settings/actions/currency', () => ({
	addCurrencySubmit: jest.fn(),
	deleteCurrency: jest.fn()
}));

const mockFormContext = useFormContext as unknown as jest.Mock;
const mockUseActionState = React.useActionState as unknown as jest.Mock;
const mockStartTransition = React.startTransition as unknown as jest.Mock;

const setAllMock = jest.fn();
const formActionMock = jest.fn();
const deleteFormActionMock = jest.fn();

const mockList = [{ id: 'cur-1', title: 'Dollar', value: 'USD' }];

type TMockState = {
	ok: boolean;
	item?: { id: string; title: string; value: string };
};

const setupHook = () => {
	const addState: TMockState = { ok: false };
	mockUseActionState.mockReset();
	mockUseActionState.mockImplementation(handler => {
		if (handler === addCurrencySubmit) {
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

describe('useActions (currency)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		setAllMock.mockClear();
		formActionMock.mockClear();
		deleteFormActionMock.mockClear();
	});

	describe('positive cases', () => {
		test('submits form data via startTransition', () => {
			setupHook();
			const { result } = renderHook(() => useActions());

			act(() => {
				result.current.onSubmit({ title: 'Euro', value: 'EUR' });
			});

			expect(mockStartTransition).toHaveBeenCalled();
			const fd = formActionMock.mock.calls[0][0] as FormData;
			expect(fd.get('title')).toBe('Euro');
			expect(fd.get('value')).toBe('EUR');
		});
	});

	describe('negative cases', () => {
		test('deleteEntity sends id to server action', () => {
			setupHook();
			const { result } = renderHook(() => useActions());

			act(() => {
				result.current.deleteEntity('cur-9');
			});

			const fd = deleteFormActionMock.mock.calls[0][0] as FormData;
			expect(fd.get('id')).toBe('cur-9');
		});
	});

	describe('edge cases', () => {
		test('appends created item to list and resets form', () => {
			const { addState, resetMock } = setupHook();
			const { result, rerender } = renderHook(() => useActions());

			addState.ok = true;
			addState.item = {
				id: 'cur-2',
				title: 'Pound',
				value: 'GBP'
			};

			rerender();

			expect(setAllMock).toHaveBeenCalledWith([
				...mockList,
				{ id: 'cur-2', title: 'Pound', value: 'GBP' }
			]);
			expect(resetMock).toHaveBeenCalled();
		});
	});
});
