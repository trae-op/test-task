import { render, screen } from '@testing-library/react';

import { CurrencyList } from '@/app/_conceptions/Settings/components/Currency/List';
import { useListSelector } from '@/app/_conceptions/Settings/context/currency/useSelectors';

jest.mock('@/app/_conceptions/Settings/context/currency/useContext', () => ({
	useListSelector: jest.fn()
}));

jest.mock(
	'@/app/_conceptions/Settings/components/Currency/DeleteButton',
	() => ({
		DeleteButton: ({ entityId }: { entityId: string }) => (
			<button data-testid={`settings-currency-delete-${entityId}`}>
				Delete
			</button>
		)
	})
);

describe('CurrencyList', () => {
	beforeEach(() => {
		(useListSelector as jest.Mock).mockReset();
	});

	describe('positive cases', () => {
		test('renders list items when data available', () => {
			(useListSelector as jest.Mock).mockReturnValue([
				{ id: '1', title: 'Dollar', value: 'USD' },
				{ id: '2', title: 'Euro', value: 'EUR' }
			]);

			render(<CurrencyList />);

			expect(screen.getByTestId('settings-currency-list')).toBeInTheDocument();
			expect(screen.getByTestId('settings-currency-item-1')).toHaveTextContent(
				'Dollar'
			);
			expect(
				screen.getByTestId('settings-currency-delete-2')
			).toBeInTheDocument();
		});
	});

	describe('negative cases', () => {
		test('returns null when list empty', () => {
			(useListSelector as jest.Mock).mockReturnValue([]);

			const { container } = render(<CurrencyList />);

			expect(container).toBeEmptyDOMElement();
		});
	});

	describe('edge cases', () => {
		test('returns null when selector yields undefined', () => {
			(useListSelector as jest.Mock).mockReturnValue(undefined);

			const { container } = render(<CurrencyList />);

			expect(container).toBeEmptyDOMElement();
		});
	});
});
