import { act, fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

import { TitleField } from '@/app/_conceptions/UpdateOrder/components/fields/TitleField';
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
			<TitleField />
		</Wrapper>
	);

	return {
		...view,
		methods: methodsRef as UseFormReturn<TUpdateOrderFormData>
	};
};

describe('TitleField', () => {
	describe('positive cases', () => {
		test('renders label and input with placeholder', () => {
			renderWithForm();

			expect(
				screen.getByTestId('update-order-title-field')
			).toBeInTheDocument();
			expect(screen.getByTestId('update-order-title-input')).toHaveAttribute(
				'placeholder',
				'Enter title'
			);
		});
	});

	describe('negative cases', () => {
		test('marks input invalid when error message is present', async () => {
			const { methods } = renderWithForm();

			await act(async () => {
				methods.setError('title', {
					type: 'manual',
					message: 'This field is required'
				});
			});

			expect(screen.getByTestId('update-order-title-input')).toHaveClass(
				'is-invalid'
			);
			expect(screen.getByText('This field is required')).toBeInTheDocument();
		});
	});

	describe('edge cases', () => {
		test('updates form state when user types', () => {
			const { methods } = renderWithForm();

			act(() => {
				fireEvent.change(screen.getByTestId('update-order-title-input'), {
					target: { value: 'Updated title' }
				});
			});

			expect(methods.getValues('title')).toBe('Updated title');
		});
	});
});
