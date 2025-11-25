import { act, fireEvent, render, screen } from '@testing-library/react';

import { DeleteButton } from '@/app/_conceptions/Settings/components/ProductType/DeleteButton';
import { useListSelector } from '@/app/_conceptions/Settings/context/productType/useSelectors';
import { useActions } from '@/app/_conceptions/Settings/hooks/productType';

jest.mock('next-intl', () => ({
	useTranslations: () => (value: string) => value
}));

jest.mock('react-dom', () => ({
	...jest.requireActual('react-dom'),
	useFormStatus: jest.fn(() => ({ pending: false }))
}));

jest.mock('@/app/_conceptions/Settings/context/productType/useContext', () => ({
	useListSelector: jest.fn()
}));

jest.mock('@/app/_conceptions/Settings/hooks/productType', () => ({
	useActions: jest.fn()
}));

describe('ProductType DeleteButton', () => {
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
		test('invokes delete action on submit', async () => {
			(useListSelector as jest.Mock).mockReturnValue([
				{ id: 'pt-1', title: 'Accessory', value: 'accessory' }
			]);

			render(<DeleteButton entityId='pt-1' />);

			const form = screen.getByTestId('settings-product-type-delete-form-pt-1');
			await act(async () => {
				fireEvent.submit(form);
			});

			expect(mockDeleteEntity).toHaveBeenCalledWith('pt-1');
		});
	});

	describe('negative cases', () => {
		test('does not render when list empty', () => {
			(useListSelector as jest.Mock).mockReturnValue([]);

			const { container } = render(<DeleteButton entityId='pt-1' />);
			expect(container).toBeEmptyDOMElement();
		});
	});

	describe('edge cases', () => {
		test('does not render when items undefined', () => {
			(useListSelector as jest.Mock).mockReturnValue(undefined);

			const { container } = render(<DeleteButton entityId='pt-1' />);
			expect(container).toBeEmptyDOMElement();
		});
	});
});
