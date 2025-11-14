import { render, screen } from '@testing-library/react';

import { PickupLocationPopup } from '@/app/_conceptions/Settings/components/PickupLocation/Popup';

const buttonMock = jest.fn();
const popupPropsMock = jest.fn();
const locationMapMock = jest.fn();

jest.mock('@/components/Button', () => ({
	Button: (props: any) => {
		buttonMock(props);
		return (
			<button type={props.type ?? 'button'} data-testid='trigger-button'>
				{props.children}
			</button>
		);
	}
}));

jest.mock('@/components/Popup/Popup', () => ({
	Popup: (props: any) => {
		popupPropsMock(props);
		return <div data-testid='popup'>{props.children}</div>;
	}
}));

jest.mock('@/components/LocationMap', () => ({
	LocationMap: (props: any) => {
		locationMapMock(props);
		return <div data-testid='location-map' />;
	}
}));

describe('components/settings/pickupLocation/PickupLocationPopup', () => {
	beforeEach(() => {
		buttonMock.mockClear();
		popupPropsMock.mockClear();
		locationMapMock.mockClear();
	});

	const createProps = () => ({
		items: [],
		pendingLocation: undefined,
		onSuccessfulLocation: jest.fn(),
		onSelectLocation: jest.fn(),
		onOpen: jest.fn(),
		onApply: jest.fn(),
		clearError: jest.fn(),
		isSubmitting: false,
		errorCode: undefined
	});

	it('passes props to Popup and LocationMap', () => {
		const props = createProps();
		render(<PickupLocationPopup {...props} />);

		expect(screen.getByTestId('location-map')).toBeInTheDocument();
		expect(locationMapMock).toHaveBeenCalledWith({
			onSuccessfulLocation: props.onSuccessfulLocation,
			initialLocation: undefined
		});

		expect(popupPropsMock).toHaveBeenCalledWith(
			expect.objectContaining({
				title: 'Add pickup location',
				onApply: props.onApply,
				onOpen: props.onOpen,
				onHide: props.clearError,
				isLoading: false
			})
		);

		const { componentButton: Trigger } = popupPropsMock.mock.calls[0][0];
		render(<Trigger />);
		expect(buttonMock).toHaveBeenLastCalledWith(
			expect.objectContaining({
				variant: 'success',
				text: 'Add pickup location'
			})
		);
	});

	it('renders translated error message when errorCode provided', () => {
		render(
			<PickupLocationPopup {...createProps()} errorCode='INVALID_INPUT' />
		);
		expect(screen.getByText('Invalid location data')).toBeInTheDocument();
	});
});
