import { act, fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

import type { OptionType } from '@/components/MultiSelectField/types';

import { ProductsField } from '@/app/_conceptions/UpdateOrder/components/fields/ProductsField';
import type { TUpdateOrderFormData } from '@/app/_conceptions/UpdateOrder/hooks/types';

const multiSelectMock = jest.fn();

jest.mock(
	'next/dynamic',
	() => (factory: () => Promise<{ MultiSelectField: React.ComponentType }>) => {
		const module = require('@/components/MultiSelectField');
		return module.MultiSelectField;
	}
);

jest.mock('@/components/MultiSelectField', () => ({
	MultiSelectField: (props: {
		options?: OptionType[];
		value?: OptionType[];
		onChange: (value: OptionType[], action: { action: string }) => void;
		placeholder?: string;
	}) => {
		multiSelectMock(props);
		return (
			<div data-testid='update-order-products-input'>
				<button
					type='button'
					data-testid='update-order-products-trigger'
					onClick={() =>
						props.onChange(
							[
								{ value: 'product-1', label: 'Product One' },
								{ value: 'product-2', label: 'Product Two' }
							],
							{ action: 'select-option' }
						)
					}
				>
					Select products
				</button>
				<span data-testid='update-order-products-value'>
					{JSON.stringify(props.value ?? [])}
				</span>
			</div>
		);
	}
}));

jest.mock('next-intl', () => ({
	useTranslations: jest.fn(() => (key: string) => key)
}));

type TWrapperProps = {
	children?: React.ReactNode;
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
			<ProductsField />
		</Wrapper>
	);

	return {
		...view,
		methods: methodsRef as UseFormReturn<TUpdateOrderFormData>
	};
};

describe('ProductsField', () => {
	beforeEach(() => {
		multiSelectMock.mockClear();
	});

	describe('positive cases', () => {
		test('renders label and passes placeholder to multiselect', () => {
			renderWithForm({
				defaultValues: {
					productOptions: [
						{ value: 'product-1', label: 'Product One' },
						{ value: 'product-2', label: 'Product Two' }
					]
				}
			});

			expect(
				screen.getByTestId('update-order-products-field')
			).toBeInTheDocument();
			expect(multiSelectMock).toHaveBeenCalled();
			const props = multiSelectMock.mock.calls[0]?.[0] as {
				placeholder?: string;
			};
			expect(props?.placeholder).toBe('Select');
		});
	});

	describe('negative cases', () => {
		test('initializes with empty selections when no options provided', () => {
			renderWithForm();

			const props = multiSelectMock.mock.calls[0]?.[0] as {
				options?: OptionType[];
				value?: OptionType[];
			};

			expect(props?.options).toEqual([]);
			expect(props?.value).toEqual([]);
		});
	});

	describe('edge cases', () => {
		test('updates selected products when change handler fires', () => {
			const { methods } = renderWithForm({
				defaultValues: {
					productOptions: [{ value: 'product-1', label: 'Product One' }]
				}
			});

			act(() => {
				fireEvent.click(screen.getByTestId('update-order-products-trigger'));
			});

			const selected = methods.getValues('productsSelected') as OptionType[];
			expect(selected).toHaveLength(2);
			expect(selected[0]?.value).toBe('product-1');
		});
	});
});
