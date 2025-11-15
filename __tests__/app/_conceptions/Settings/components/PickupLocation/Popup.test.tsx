import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import type { TLocationFormValue } from '@/types/location';
import type { TPickupLocation } from '@/types/pickupLocation';

import { PickupLocationPopup } from '@/app/_conceptions/Settings/components/PickupLocation/Popup';
import type { TPickupLocationItem } from '@/app/_conceptions/Settings/components/PickupLocation/types';

type PopupPropsCapture = {
	onOpen?: () => void;
	onApply?: (onClose: () => void) => void;
	onHide?: () => void;
	children?: ReactNode;
};

const capturedPopupProps: PopupPropsCapture[] = [];

jest.mock('next-intl', () => ({
	useTranslations: () => (value: string) => value
}));

jest.mock('@/components/Popup/Popup', () => ({
	Popup: (props: PopupPropsCapture) => {
		capturedPopupProps.push(props);
		return (
			<div data-testid='settings-pickup-popup-shell'>
				<button
					data-testid='settings-pickup-popup-apply'
					onClick={() => props.onApply?.(() => void 0)}
				>
					Apply
				</button>
				<button
					data-testid='settings-pickup-popup-open'
					onClick={() => props.onOpen?.()}
				>
					Open
				</button>
				<button
					data-testid='settings-pickup-popup-hide'
					onClick={() => props.onHide?.()}
				>
					Hide
				</button>
				{props.children}
			</div>
		);
	}
}));

const capturedLocationMaps: TLocationFormValue[] = [];

jest.mock('@/components/LocationMap', () => ({
	LocationMap: ({
		initialLocation
	}: {
		initialLocation?: TLocationFormValue;
	}) => {
		if (initialLocation) {
			capturedLocationMaps.push(initialLocation);
		}
		return <div data-testid='settings-pickup-map' />;
	}
}));

describe('PickupLocationPopup', () => {
	const baseItems: TPickupLocationItem[] = [
		{
			id: 'loc-1',
			label: 'Warehouse',
			location: { lat: 1, lng: 2 },
			entity: { id: 'loc-1' } as TPickupLocation
		}
	];

	const defaultProps = {
		items: baseItems,
		pendingLocation: { lat: 1, lng: 2 },
		onSuccessfulLocation: jest.fn(),
		onSelectLocation: jest.fn(),
		onOpen: jest.fn(),
		onApply: jest.fn().mockResolvedValue(undefined),
		clearError: jest.fn(),
		isSubmitting: false,
		errorCode: undefined
	};

	beforeEach(() => {
		capturedPopupProps.length = 0;
		capturedLocationMaps.length = 0;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('positive cases', () => {
		test('renders map and wires popup callbacks', () => {
			render(<PickupLocationPopup {...defaultProps} />);

			expect(screen.getByTestId('settings-pickup-map')).toBeInTheDocument();
			expect(capturedLocationMaps[0]).toEqual({ lat: 1, lng: 2 });

			fireEvent.click(screen.getByTestId('settings-pickup-popup-open'));
			expect(defaultProps.onOpen).toHaveBeenCalled();

			fireEvent.click(screen.getByTestId('settings-pickup-popup-apply'));
			expect(defaultProps.onApply).toHaveBeenCalled();
		});
	});

	describe('negative cases', () => {
		test('shows translated error message for server code', () => {
			render(
				<PickupLocationPopup {...defaultProps} errorCode='SERVER_ERROR' />
			);

			expect(screen.getByTestId('settings-pickup-error')).toHaveTextContent(
				'Failed to save pickup location'
			);
		});
	});

	describe('edge cases', () => {
		test('clears error on hide callback', () => {
			render(<PickupLocationPopup {...defaultProps} />);
			fireEvent.click(screen.getByTestId('settings-pickup-popup-hide'));
			expect(defaultProps.clearError).toHaveBeenCalled();
		});
	});
});
