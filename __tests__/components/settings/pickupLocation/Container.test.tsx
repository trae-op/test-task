import { render, screen } from '@testing-library/react';

import { PickupLocationContainer } from '@/app/_conceptions/Settings/PickupLocation/Container';

jest.mock('@/hooks/settings/pickupLocation', () => ({
	usePickupLocation: jest.fn()
}));

jest.mock('@/app/_conceptions/Settings/PickupLocation/List', () => ({
	PickupLocationList: jest.fn(() => <div data-testid='pickup-location-list' />)
}));

jest.mock('@/app/_conceptions/Settings/PickupLocation/Popup', () => ({
	PickupLocationPopup: jest.fn(() => (
		<div data-testid='pickup-location-popup' />
	))
}));

const { usePickupLocation } = jest.requireMock(
	'@/hooks/settings/pickupLocation'
);
const { PickupLocationList } = jest.requireMock(
	'@/app/_conceptions/Settings/PickupLocation/List'
);
const { PickupLocationPopup } = jest.requireMock(
	'@/app/_conceptions/Settings/PickupLocation/Popup'
);

describe('components/settings/pickupLocation/PickupLocationContainer', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders header and wires list and popup props from hook', () => {
		const hookValue = {
			items: [{ id: 'loc-1' }],
			pendingLocation: { lat: 1, lng: 2 },
			isSubmitting: false,
			errorCode: 'UNAUTHORIZED',
			handleSuccessfulLocation: jest.fn(),
			handleSelectLocation: jest.fn(),
			handleOpen: jest.fn(),
			handleApply: jest.fn(),
			clearError: jest.fn()
		};
		(usePickupLocation as jest.Mock).mockReturnValue(hookValue);

		render(<PickupLocationContainer />);

		expect(
			screen.getByRole('heading', { name: 'Pickup locations' })
		).toBeInTheDocument();
		expect(screen.getByTestId('pickup-location-list')).toBeInTheDocument();
		expect(screen.getByTestId('pickup-location-popup')).toBeInTheDocument();

		expect(PickupLocationList).toHaveBeenCalled();
		const listProps = (PickupLocationList as jest.Mock).mock.calls[0]?.[0];
		expect(listProps).toMatchObject({ items: [{ id: 'loc-1' }] });

		expect(PickupLocationPopup).toHaveBeenCalled();
		const popupProps = (PickupLocationPopup as jest.Mock).mock.calls[0]?.[0];
		expect(popupProps).toMatchObject({
			items: [{ id: 'loc-1' }],
			pendingLocation: { lat: 1, lng: 2 },
			isSubmitting: false,
			errorCode: 'UNAUTHORIZED',
			onSuccessfulLocation: hookValue.handleSuccessfulLocation,
			onSelectLocation: hookValue.handleSelectLocation,
			onOpen: hookValue.handleOpen,
			onApply: hookValue.handleApply,
			clearError: hookValue.clearError
		});
	});
});
