import { render, screen } from '@testing-library/react';

import type { TPickupLocation } from '@/types/pickupLocation';

import { PickupLocationContainer } from '@/app/_conceptions/Settings/components/PickupLocation/Container';
import { usePickupLocation } from '@/app/_conceptions/Settings/hooks/pickupLocation';
import type { TPickupLocationItem } from '@/app/_conceptions/Settings/hooks/pickupLocation/types';

const pickupListSpy = jest.fn();
const popupSpy = jest.fn();

jest.mock('next-intl', () => ({
	useTranslations: () => (value: string) => value
}));

jest.mock('@/app/_conceptions/Settings/hooks/pickupLocation', () => ({
	usePickupLocation: jest.fn()
}));

jest.mock('@/app/_conceptions/Settings/components/PickupLocation/List', () => ({
	PickupLocationList: (props: { items: TPickupLocationItem[] }) => {
		pickupListSpy(props);
		return <div data-testid='settings-pickup-list-stub' />;
	}
}));

jest.mock(
	'@/app/_conceptions/Settings/components/PickupLocation/Popup',
	() => ({
		PickupLocationPopup: (props: Record<string, unknown>) => {
			popupSpy(props);
			return <div data-testid='settings-pickup-popup-stub' />;
		}
	})
);

describe('PickupLocationContainer', () => {
	const mockItems: TPickupLocationItem[] = [
		{
			id: 'loc-1',
			label: 'Warehouse',
			location: { lat: 1, lng: 2 },
			entity: { id: 'loc-1' } as TPickupLocation
		}
	];

	beforeEach(() => {
		pickupListSpy.mockClear();
		popupSpy.mockClear();
		(usePickupLocation as jest.Mock).mockReturnValue({
			items: mockItems,
			pendingLocation: { lat: 1, lng: 2 },
			isSubmitting: false,
			errorCode: undefined,
			handleSuccessfulLocation: jest.fn(),
			handleSelectLocation: jest.fn(),
			handleOpen: jest.fn(),
			handleApply: jest.fn(),
			clearError: jest.fn()
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('positive cases', () => {
		test('passes hook items to list and popup', () => {
			render(<PickupLocationContainer />);

			expect(
				screen.getByTestId('settings-pickup-list-stub')
			).toBeInTheDocument();
			expect(pickupListSpy).toHaveBeenCalledWith({ items: mockItems });
			expect(
				screen.getByTestId('settings-pickup-popup-stub')
			).toBeInTheDocument();
			expect(popupSpy).toHaveBeenCalled();
		});
	});

	describe('edge cases', () => {
		test('forwards error and handlers to popup', () => {
			const hookValue = {
				items: mockItems,
				pendingLocation: undefined,
				isSubmitting: true,
				errorCode: 'SERVER_ERROR',
				handleSuccessfulLocation: jest.fn(),
				handleSelectLocation: jest.fn(),
				handleOpen: jest.fn(),
				handleApply: jest.fn(),
				clearError: jest.fn()
			};
			(usePickupLocation as jest.Mock).mockReturnValueOnce(hookValue);

			render(<PickupLocationContainer />);

			const popupArgs = popupSpy.mock.calls[0][0] as typeof hookValue;
			expect(popupArgs.errorCode).toBe('SERVER_ERROR');
			expect(popupArgs.isSubmitting).toBe(true);
		});
	});
});
