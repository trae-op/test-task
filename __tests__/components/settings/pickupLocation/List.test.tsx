import { render, screen } from '@testing-library/react';

import type { TPickupLocation } from '@/types/pickupLocation';

import { PickupLocationList } from '@/app/_conceptions/Settings/PickupLocation/List';
import type { TPickupLocationItem } from '@/app/_conceptions/Settings/PickupLocation/types';

jest.mock('@/actions/pickupLocation', () => ({
	deletePickupLocationById: jest.fn()
}));

let useActionStateState: { ok: boolean } | undefined;
let formActionMock: jest.Mock;

jest.mock('react', () => {
	const actual = jest.requireActual('react');
	return {
		...actual,
		useActionState: (_fn: any, initialState: any) => {
			formActionMock = jest.fn();
			return [useActionStateState ?? initialState, formActionMock, false];
		}
	};
});

let formStatus = { pending: false };

jest.mock('react-dom', () => {
	const actual = jest.requireActual('react-dom');
	return {
		...actual,
		useFormStatus: () => formStatus
	};
});

jest.mock('@/context/pickupLocation/useContext', () => ({
	useEntityContext: jest.fn()
}));

const { useEntityContext } = jest.requireMock(
	'@/context/pickupLocation/useContext'
);

const createEntity = (id: string): TPickupLocation => ({
	id,
	latitude: 50,
	longitude: 30,
	country: null,
	state: null,
	city: null,
	district: null,
	street: null,
	postcode: null,
	displayName: null,
	userId: 'user-1'
});

const createItem = (id: string, label: string): TPickupLocationItem => ({
	id,
	label,
	location: { lat: 1, lng: 2 },
	entity: createEntity(id)
});

describe('components/settings/pickupLocation/PickupLocationList', () => {
	beforeEach(() => {
		useActionStateState = undefined;
		formStatus = { pending: false };
		jest.clearAllMocks();
	});

	it('renders empty state message when no items', () => {
		render(<PickupLocationList items={[]} />);
		expect(screen.getByText('No pickup locations yet')).toBeInTheDocument();
	});

	it('shows list items and wires delete action', () => {
		const get = jest.fn(() => [createEntity('loc-1')]);
		const setAll = jest.fn();
		(useEntityContext as jest.Mock).mockReturnValue({ get, setAll });
		const { container } = render(
			<PickupLocationList items={[createItem('loc-1', 'Location A')]} />
		);

		expect(screen.getByText('Location A')).toBeInTheDocument();
		const deleteButton = screen.getByRole('button', { name: 'Delete' });
		expect(deleteButton).toBeEnabled();
		expect(deleteButton).toHaveAttribute('type', 'submit');
		expect(typeof formActionMock).toBe('function');
		const hiddenInput = container.querySelector('input[name="id"]');
		expect(hiddenInput).toHaveValue('loc-1');
	});

	it('disables delete button while pending', () => {
		formStatus = { pending: true };
		const get = jest.fn(() => [createEntity('loc-1')]);
		const setAll = jest.fn();
		(useEntityContext as jest.Mock).mockReturnValue({ get, setAll });

		render(<PickupLocationList items={[createItem('loc-1', 'Location A')]} />);

		const deleteButton = screen.getByRole('button', { name: 'Delete' });
		expect(deleteButton).toBeDisabled();
		expect(deleteButton.querySelector('.spinner-border')).not.toBeNull();
	});

	it('filters context list when action reports success', () => {
		useActionStateState = { ok: true };
		let contextItems = [createEntity('loc-1'), createEntity('loc-2')];
		const get = jest.fn(() => contextItems);
		const setAll = jest.fn((next: TPickupLocation[]) => {
			contextItems = next;
		});
		(useEntityContext as jest.Mock).mockReturnValue({ get, setAll });

		render(<PickupLocationList items={[createItem('loc-1', 'Location A')]} />);

		expect(setAll).toHaveBeenCalledWith([
			expect.objectContaining({ id: 'loc-2' })
		]);
	});
});
