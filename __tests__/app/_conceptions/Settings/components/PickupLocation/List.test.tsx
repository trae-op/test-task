import {
	act,
	fireEvent,
	render,
	screen,
	waitFor
} from '@testing-library/react';
import * as React from 'react';

import type { TPickupLocation } from '@/types/pickupLocation';

import { PickupLocationList } from '@/app/_conceptions/Settings/components/PickupLocation/List';
import type { TPickupLocationItem } from '@/app/_conceptions/Settings/components/PickupLocation/types';
import { useEntityContext } from '@/app/_conceptions/Settings/context/pickupLocation/useSelectors';

jest.mock('next-intl', () => ({
	useTranslations: () => (value: string) => value
}));

jest.mock(
	'@/app/_conceptions/Settings/context/pickupLocation/useContext',
	() => ({
		useEntityContext: jest.fn()
	})
);

jest.mock('@/app/_conceptions/Settings/actions/pickupLocation', () => ({
	deletePickupLocationById: jest.fn()
}));

jest.mock('react', () => {
	const actual = jest.requireActual('react');
	return {
		...actual,
		useActionState: jest.fn()
	};
});

describe('PickupLocationList', () => {
	const mockUseActionState = React.useActionState as unknown as jest.Mock;
	const formActionMock = jest.fn();
	const getMock = jest.fn();
	const setAllMock = jest.fn();

	beforeEach(() => {
		mockUseActionState.mockReset();
		formActionMock.mockReset();
		getMock.mockReset();
		setAllMock.mockReset();
		(useEntityContext as jest.Mock).mockReturnValue({
			get: getMock,
			setAll: setAllMock,
			setListLoading: jest.fn(),
			subscribe: jest.fn(),
			isLoading: jest.fn()
		});
	});

	describe('positive cases', () => {
		test('renders list and reacts to successful deletion', async () => {
			mockUseActionState.mockReturnValue([{ ok: true }, formActionMock]);
			const entity = { id: 'loc-1' } as TPickupLocation;
			const item: TPickupLocationItem = {
				id: 'loc-1',
				label: 'Warehouse',
				location: { lat: 1, lng: 2 },
				entity
			};
			getMock.mockReturnValue([
				{ id: 'loc-1', label: 'Warehouse', entity } as {
					id: string;
					label: string;
					entity: TPickupLocation;
				}
			]);

			render(<PickupLocationList items={[item]} />);

			expect(screen.getByTestId('settings-pickup-list')).toBeInTheDocument();
			expect(
				screen.getByTestId('settings-pickup-item-loc-1')
			).toHaveTextContent('Warehouse');

			const deleteButton = screen.getByTestId('settings-pickup-delete-button');
			await act(async () => {
				fireEvent.submit(deleteButton.closest('form') as HTMLFormElement);
			});

			expect(formActionMock).toHaveBeenCalledTimes(1);

			await waitFor(() => {
				expect(setAllMock).toHaveBeenCalledWith([]);
			});
		});
	});

	describe('negative cases', () => {
		test('shows empty message when no items', () => {
			render(<PickupLocationList items={[]} />);
			expect(screen.getByTestId('settings-pickup-empty')).toHaveTextContent(
				'No pickup locations yet'
			);
		});
	});

	describe('edge cases', () => {
		test('does not call setAll when entities unchanged', async () => {
			mockUseActionState.mockReturnValue([{ ok: true }, formActionMock]);
			getMock.mockReturnValue([
				{
					id: 'loc-2',
					label: 'Depot',
					entity: { id: 'loc-2' } as TPickupLocation
				}
			]);

			const item: TPickupLocationItem = {
				id: 'loc-3',
				label: 'Office',
				location: { lat: 1, lng: 2 },
				entity: { id: 'loc-3' } as TPickupLocation
			};

			render(<PickupLocationList items={[item]} />);

			await waitFor(() => {
				expect(setAllMock).not.toHaveBeenCalled();
			});
		});
	});
});
