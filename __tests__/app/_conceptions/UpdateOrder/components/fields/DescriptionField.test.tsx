import { act, fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

import { DescriptionField } from '@/app/_conceptions/UpdateOrder/components/fields/DescriptionField';
import type { TUpdateOrderFormData } from '@/app/_conceptions/UpdateOrder/hooks/types';

jest.mock('next-intl', () => ({
	useTranslations: jest.fn(() => (key: string) => key)
}));

type TWrapperProps = {
	children: React.ReactNode;
	defaultValues?: Partial<TUpdateOrderFormData>;
};

const renderWithForm = (props?: TWrapperProps) => {
	let methodsRef: UseFormReturn<TUpdateOrderFormData> | undefined;

	const Wrapper = ({ children, defaultValues }: TWrapperProps) => {
		methodsRef = useForm<TUpdateOrderFormData>({
			defaultValues: {
				orderId: '',
				title: '',
				description: undefined,
				productOptions: [],
				productsSelected: [],
				location: undefined,
				...(defaultValues ?? {})
			}
		});

		return <FormProvider {...methodsRef}>{children}</FormProvider>;
	};

	const view = render(
		<Wrapper {...(props ?? {})}>
			<DescriptionField />
		</Wrapper>
	);

	return {
		...view,
		methods: methodsRef as UseFormReturn<TUpdateOrderFormData>
	};
};

describe('DescriptionField', () => {
	describe('positive cases', () => {
		test('shows descriptive placeholder text', () => {
			renderWithForm();

			expect(
				screen.getByTestId('update-order-description-field')
			).toBeInTheDocument();
			expect(
				screen.getByTestId('update-order-description-input')
			).toHaveAttribute('placeholder', 'Enter description');
		});
	});

	describe('negative cases', () => {
		test('renders empty value when description is nullish', () => {
			renderWithForm({
				defaultValues: {
					description: null
				},
				children: undefined
			});

			expect(
				screen.getByTestId(
					'update-order-description-input'
				) as HTMLTextAreaElement
			).toHaveDisplayValue('');
		});
	});

	describe('edge cases', () => {
		test('handles multiline text updates', () => {
			const { methods } = renderWithForm();
			const value = 'Line 1\nLine 2';

			act(() => {
				fireEvent.change(screen.getByTestId('update-order-description-input'), {
					target: { value }
				});
			});

			expect(methods.getValues('description')).toBe(value);
			expect(
				screen.getByTestId(
					'update-order-description-input'
				) as HTMLTextAreaElement
			).toHaveDisplayValue(value);
		});
	});
});
