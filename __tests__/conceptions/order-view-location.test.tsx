import type { OrderLocation } from '@prisma/client';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { OrderViewLocation } from '@/app/_conceptions/OrderViewLocation/OrderViewLocation';

const popupProps: any[] = [];
const locationMapMock = jest.fn();

jest.mock('@/components/Popup/Popup', () => ({
	Popup: (props: any) => {
		popupProps.push(props);
		return <div data-testid='popup'>{props.children}</div>;
	}
}));

jest.mock('@/components/LocationMap', () => ({
	LocationMap: (props: any) => {
		locationMapMock(props);
		return <div data-testid='location-map' />;
	}
}));

describe('OrderViewLocation', () => {
	beforeEach(() => {
		popupProps.length = 0;
		locationMapMock.mockClear();
	});

	it('renders popup trigger and location details when location exists', () => {
		const location: OrderLocation = {
			id: 'loc-1',
			latitude: 50.4501,
			longitude: 30.5234,
			country: 'Ukraine',
			state: null,
			city: 'Kyiv',
			district: null,
			street: 'Khreshchatyk',
			postcode: null,
			displayName: 'Kyiv',
			orderId: 'order-1',
			userId: 'user-1'
		};

		render(<OrderViewLocation location={location} />);

		const popup = popupProps[0];

		expect(popup).toBeDefined();
		expect(popup.openButtonAriaLabel).toBe('View location');
		expect(screen.getByText('Selected location')).toBeInTheDocument();
		expect(screen.getByText('Kyiv')).toBeInTheDocument();

		expect(popup.showApplyButton).toBe(false);
		expect(popup.cancelText).toBe('Close');

		expect(locationMapMock).toHaveBeenCalledWith(
			expect.objectContaining({
				showSearchControls: false,
				isInteractive: false,
				initialLocation: expect.objectContaining({
					lat: 50.4501,
					lng: 30.5234
				})
			})
		);
	});

	it('renders fallback text when location is missing', () => {
		render(<OrderViewLocation location={null} />);

		expect(screen.getByText('Location is not available')).toBeInTheDocument();
		expect(locationMapMock).not.toHaveBeenCalled();
	});
});
