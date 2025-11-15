import {
	act,
	fireEvent,
	render,
	screen,
	waitFor
} from '@testing-library/react';
import React from 'react';

import { AddOrder } from '@/app/_conceptions/AddOrder/components/AddOrder';
import { useAddOrderActions } from '@/app/_conceptions/AddOrder/hooks/useAddActions';
import type { TAddOrderProps } from '@/app/_conceptions/AddOrder/types';

jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key
}));

const multiSelectProps: Array<Record<string, unknown>> = [];

jest.mock('next/dynamic', () => ({
	__esModule: true,
	default: () => (props: Record<string, unknown>) => {
		multiSelectProps.push(props);
		return (
			<div
				data-testid='multi-select'
				onClick={() =>
					(props.onChange as (value: unknown) => void)?.([
						{ value: 'p1', label: 'Product 1' }
					])
				}
			>
				MultiSelect
			</div>
		);
	}
}));

const formValues: Record<string, string> = { title: '', description: '' };
const triggerMock = jest.fn().mockResolvedValue(true);
const getValuesMock = jest.fn(() => ({ ...formValues }));
const formState = { errors: {}, isSubmitting: false };
const registerMock = jest.fn((name: keyof typeof formValues) => ({
	name,
	onChange: (event: { target: { value: string } }) => {
		formValues[name] = event.target.value;
	},
	onBlur: jest.fn(),
	ref: jest.fn()
}));

jest.mock('react-hook-form', () => ({
	FormProvider: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	useForm: () => ({
		register: registerMock,
		getValues: getValuesMock,
		trigger: triggerMock,
		formState
	}),
	useFormContext: () => ({
		formState
	})
}));

jest.mock('@/app/_conceptions/AddOrder/hooks/useAddActions', () => ({
	useAddOrderActions: jest.fn()
}));

const mockUseAddOrderActions = useAddOrderActions as unknown as jest.Mock;

const renderComponent = (props?: Partial<TAddOrderProps>) => {
	const defaultProps: TAddOrderProps = {
		products: [
			{ id: 'p1', title: 'Product 1' } as TAddOrderProps['products'][number],
			{ id: 'p2', title: 'Product 2' } as TAddOrderProps['products'][number]
		]
	};

	return render(<AddOrder {...defaultProps} {...props} />);
};

describe('AddOrder component', () => {
	beforeEach(() => {
		multiSelectProps.length = 0;
		formValues.title = '';
		formValues.description = '';
		formState.errors = {};
		formState.isSubmitting = false;
		triggerMock.mockResolvedValue(true);
		getValuesMock.mockImplementation(() => ({ ...formValues }));
		registerMock.mockClear();
		mockUseAddOrderActions.mockReset();
	});

	test('renders products options and server error message', () => {
		mockUseAddOrderActions.mockReturnValue({
			onAddOrderSubmit: jest.fn(),
			error: 'error-key'
		});
		renderComponent();

		expect(screen.getByText('error-key')).toBeInTheDocument();
		expect(multiSelectProps[0].options).toEqual([
			{ value: 'p1', label: 'Product 1' },
			{ value: 'p2', label: 'Product 2' }
		]);
	});

	test('submits form with valid data and selected products', async () => {
		const onAddOrderSubmit = jest.fn();
		mockUseAddOrderActions.mockReturnValue({
			onAddOrderSubmit,
			error: null
		});

		renderComponent();

		fireEvent.change(screen.getByPlaceholderText('Enter title'), {
			target: { value: 'Order title' }
		});

		fireEvent.click(screen.getByTestId('multi-select'));

		await act(async () => {
			fireEvent.submit(screen.getByTestId('add-order-form'));
		});

		await waitFor(() => expect(onAddOrderSubmit).toHaveBeenCalled());

		expect(onAddOrderSubmit).toHaveBeenCalledWith(
			{
				title: 'Order title',
				description: ''
			},
			[{ value: 'p1', label: 'Product 1' }]
		);
	});

	test('prevents submit when form invalid', async () => {
		const onAddOrderSubmit = jest.fn();
		mockUseAddOrderActions.mockReturnValue({
			onAddOrderSubmit,
			error: null
		});
		triggerMock.mockResolvedValueOnce(false);

		renderComponent();

		await act(async () => {
			fireEvent.submit(screen.getByTestId('add-order-form'));
		});

		await waitFor(() => {
			expect(onAddOrderSubmit).not.toHaveBeenCalled();
		});
	});
});
