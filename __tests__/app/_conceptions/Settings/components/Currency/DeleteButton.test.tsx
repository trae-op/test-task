import { act, fireEvent, render, screen } from '@testing-library/react';

import { DeleteButton } from '@/app/_conceptions/Settings/components/Currency/DeleteButton';
import { useListSelector } from '@/app/_conceptions/Settings/context/currency/useSelectors';
import { useActions } from '@/app/_conceptions/Settings/hooks/currency';

jest.mock('next-intl', () => ({
	useTranslations: () => (value: string) => value
}));

jest.mock('react-dom', () => ({
	...jest.requireActual('react-dom'),
	useFormStatus: jest.fn(() => ({ pending: false }))
}));

jest.mock('@/app/_conceptions/Settings/context/currency/useSelectors', () => ({
	useListSelector: jest.fn()
}));

jest.mock('@/app/_conceptions/Settings/hooks/currency', () => ({
	useActions: jest.fn()
}));

describe('Currency DeleteButton', () => {
	const mockDeleteEntity = jest.fn();

	beforeEach(() => {
		(useListSelector as jest.Mock).mockReset();
		mockDeleteEntity.mockReset();
		(useActions as jest.Mock).mockReturnValue({
			deleteEntity: mockDeleteEntity,
			onSubmit: jest.fn(),
			state: { ok: false }
		});
	});

	describe('positive cases', () => {
		test('submits delete action when items exist', async () => {
			(useListSelector as jest.Mock).mockReturnValue([
				{ id: 'cur-1', title: 'Dollar', value: 'USD' }
			]);

			render(<DeleteButton entityId='cur-1' />);

			const form = screen.getByTestId('settings-currency-delete-form-cur-1');
			await act(async () => {
				fireEvent.submit(form);
			});

			expect(mockDeleteEntity).toHaveBeenCalledWith('cur-1');
			expect(
				screen.getByTestId('settings-currency-delete-button')
			).toBeEnabled();
		});
	});

	describe('negative cases', () => {
		test('returns null when there are no items', () => {
			(useListSelector as jest.Mock).mockReturnValue([]);

			const { container } = render(<DeleteButton entityId='cur-1' />);
			expect(container).toBeEmptyDOMElement();
		});
	});

	describe('edge cases', () => {
		test('does not render when selector returns undefined', () => {
			(useListSelector as jest.Mock).mockReturnValue(undefined);

			const { container } = render(<DeleteButton entityId='cur-1' />);
			expect(container).toBeEmptyDOMElement();
		});
	});
});
