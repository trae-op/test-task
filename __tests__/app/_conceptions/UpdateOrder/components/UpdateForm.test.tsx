import {
	act,
	createEvent,
	fireEvent,
	render,
	screen,
	waitFor
} from '@testing-library/react';
import * as reactHookForm from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

import { UpdateForm } from '@/app/_conceptions/UpdateOrder/components/UpdateForm';
import type { TUpdateOrderFormData } from '@/app/_conceptions/UpdateOrder/hooks/types';
import { useUpdateActions } from '@/app/_conceptions/UpdateOrder/hooks/useUpdateActions';

jest.mock('next-intl', () => ({
	useTranslations: jest.fn(() => (key: string) => key)
}));

jest.mock('react-hook-form', () => ({
	useFormContext: jest.fn()
}));

jest.mock('@/components/MessagesServer', () => ({
	MessagesServer: ({ message }: { message?: string }) => (
		<div data-testid='update-order-messages-server'>{message ?? ''}</div>
	)
}));

jest.mock(
	'@/app/_conceptions/UpdateOrder/components/fields/TitleField',
	() => ({
		TitleField: () => <div data-testid='update-order-title-field-stub' />
	})
);

jest.mock(
	'@/app/_conceptions/UpdateOrder/components/fields/DescriptionField',
	() => ({
		DescriptionField: () => (
			<div data-testid='update-order-description-field-stub' />
		)
	})
);

jest.mock(
	'@/app/_conceptions/UpdateOrder/components/fields/ProductsField',
	() => ({
		ProductsField: () => <div data-testid='update-order-products-field-stub' />
	})
);

jest.mock(
	'@/app/_conceptions/UpdateOrder/components/fields/LocationMapPopup',
	() => ({
		LocationMapPopup: () => (
			<div data-testid='update-order-location-popup-stub' />
		)
	})
);

jest.mock('@/app/_conceptions/UpdateOrder/components/SubmitButton', () => ({
	SubmitButton: () => (
		<button type='submit' data-testid='update-order-submit-stub'>
			Submit
		</button>
	)
}));

jest.mock('@/app/_conceptions/UpdateOrder/hooks/useUpdateActions', () => ({
	useUpdateActions: jest.fn()
}));

const useFormContextMock = reactHookForm.useFormContext as jest.MockedFunction<
	typeof reactHookForm.useFormContext
>;

const mockFormContext = (
	values: TUpdateOrderFormData,
	triggerResult: boolean = true
) => {
	const triggerMock = jest.fn(async () => triggerResult);
	const getValuesMock = jest.fn(() => values);

	const formReturn = {
		getValues: getValuesMock,
		trigger: triggerMock
	} as unknown as UseFormReturn<TUpdateOrderFormData>;

	useFormContextMock.mockReturnValue(formReturn);

	return { triggerMock, getValuesMock };
};

describe('UpdateForm', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useFormContextMock.mockReset();
	});

	describe('positive cases', () => {
		test('submits form data when validation passes', async () => {
			const onSubmit = jest.fn();
			(useUpdateActions as jest.Mock).mockReturnValue({
				onSubmit,
				error: undefined
			});

			const formValues: TUpdateOrderFormData = {
				orderId: 'order-123',
				title: 'Sample title',
				description: 'Sample description',
				productOptions: [],
				productsSelected: [],
				location: undefined
			};

			const { triggerMock } = mockFormContext(formValues, true);

			render(<UpdateForm />);

			const form = screen.getByTestId('update-order-form') as HTMLFormElement;

			await act(async () => {
				form.requestSubmit();
			});

			expect(triggerMock).toHaveBeenCalled();
			await waitFor(() => {
				expect(onSubmit).toHaveBeenCalledWith(formValues);
			});
		});
	});

	describe('negative cases', () => {
		test('prevents submission when validation fails', async () => {
			const onSubmit = jest.fn();
			(useUpdateActions as jest.Mock).mockReturnValue({
				onSubmit,
				error: undefined
			});

			const invalidValues: TUpdateOrderFormData = {
				orderId: 'order-404',
				title: 'Invalid',
				description: undefined,
				productOptions: [],
				productsSelected: [],
				location: undefined
			};

			const { triggerMock } = mockFormContext(invalidValues, false);

			render(<UpdateForm />);

			const form = screen.getByTestId('update-order-form');
			const preventDefault = jest.fn();
			const stopPropagation = jest.fn();
			const submitEvent = createEvent.submit(form);
			submitEvent.preventDefault = preventDefault;
			submitEvent.stopPropagation = stopPropagation;
			await act(async () => {
				fireEvent(form, submitEvent);
			});

			expect(triggerMock).toHaveBeenCalled();
			expect(preventDefault).toHaveBeenCalled();
			expect(stopPropagation).toHaveBeenCalled();
		});
	});

	describe('edge cases', () => {
		test('renders header and passes error message to MessagesServer', () => {
			(useUpdateActions as jest.Mock).mockReturnValue({
				onSubmit: jest.fn(),
				error: 'server-error'
			});

			const defaultValues: TUpdateOrderFormData = {
				orderId: '',
				title: '',
				description: undefined,
				productOptions: [],
				productsSelected: [],
				location: undefined
			};

			mockFormContext(defaultValues, true);

			render(<UpdateForm />);

			expect(screen.getByTestId('update-order-header')).toHaveTextContent(
				'Update order'
			);
			expect(
				screen.getByTestId('update-order-messages-server')
			).toHaveTextContent('server-error');
		});
	});
});
