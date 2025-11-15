import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TLocationFormValue } from '@/types/location';
import type { TOrder } from '@/types/orders';
import type { TProduct } from '@/types/products';

import { Container } from '@/app/_conceptions/UpdateOrder/components/Container';
import type { TUpdateOrderFormData } from '@/app/_conceptions/UpdateOrder/hooks/types';

jest.mock('@/app/_conceptions/UpdateOrder/components/UpdateForm', () => {
	const React = require('react');
	const { useFormContext } = require('react-hook-form');
	return {
		UpdateForm: () => {
			const form = useFormContext();
			const values = form.getValues() as TUpdateOrderFormData;
			const location = values.location as TLocationFormValue | undefined;
			return (
				<div data-testid='update-order-form-stub'>
					<span data-testid='update-order-default-order-id'>
						{values.orderId}
					</span>
					<span data-testid='update-order-default-title'>{values.title}</span>
					<span data-testid='update-order-default-description'>
						{values.description ?? ''}
					</span>
					<span data-testid='update-order-default-products-selected'>
						{JSON.stringify(values.productsSelected ?? [])}
					</span>
					<span data-testid='update-order-default-product-options'>
						{JSON.stringify(values.productOptions ?? [])}
					</span>
					<span data-testid='update-order-default-location'>
						{location ? `${location.lat}-${location.lng}` : ''}
					</span>
				</div>
			);
		}
	};
});

type TWrapperProps = {
	children: React.ReactNode;
	defaultValues?: Partial<TUpdateOrderFormData>;
};

const Wrapper = ({ children, defaultValues }: TWrapperProps) => {
	const methods = useForm<TUpdateOrderFormData>({
		defaultValues: {
			orderId: '',
			title: '',
			description: undefined,
			productOptions: [],
			productsSelected: [],
			location: undefined,
			...defaultValues
		}
	});

	return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('Container', () => {
	describe('positive cases', () => {
		test('populates form defaults from provided values', () => {
			const orderProducts: TProduct[] = [
				{
					id: 'product-1',
					serialNumber: 'SN-1',
					isNew: true,
					photo: 'photo-url',
					title: 'Product Alpha',
					type: 'type-a',
					specification: 'Spec',
					guaranteeStart: new Date('2024-01-01T00:00:00Z'),
					guaranteeEnd: new Date('2025-01-01T00:00:00Z'),
					date: null,
					orderId: 'order-1',
					userId: 'user-1',
					prices: []
				}
			];
			const location = {
				id: 'location-1',
				latitude: 51.5,
				longitude: -0.12,
				country: 'UK',
				state: 'England',
				city: 'London',
				district: 'Central',
				street: 'Baker Street',
				postcode: 'NW16XE',
				displayName: '221B Baker Street',
				orderId: 'order-1',
				userId: 'user-1'
			};
			const values: TOrder = {
				id: 'order-1',
				title: 'Alpha Order',
				description: 'Important order',
				date: new Date('2024-02-01T00:00:00Z'),
				amountOfProducts: 1,
				userId: 'user-1',
				products: orderProducts,
				location
			};
			const productOptions: { id: string; title: string | null }[] = [
				{ id: 'product-1', title: 'Product Alpha' },
				{ id: 'product-2', title: 'Product Beta' }
			];

			render(
				<Wrapper>
					<Container values={values} products={productOptions} />
				</Wrapper>
			);

			expect(
				screen.getByTestId('update-order-default-order-id')
			).toHaveTextContent('order-1');
			expect(
				screen.getByTestId('update-order-default-title')
			).toHaveTextContent('Alpha Order');
			expect(
				screen.getByTestId('update-order-default-description')
			).toHaveTextContent('Important order');

			const selected = JSON.parse(
				screen.getByTestId('update-order-default-products-selected')
					.textContent || '[]'
			) as OptionType[];
			expect(selected).toHaveLength(1);
			expect(selected[0]?.value).toBe('product-1');

			const options = JSON.parse(
				screen.getByTestId('update-order-default-product-options')
					.textContent || '[]'
			) as OptionType[];
			expect(options.map(option => option.value)).toEqual([
				'product-1',
				'product-2'
			]);

			expect(
				screen.getByTestId('update-order-default-location')
			).toHaveTextContent('51.5--0.12');
		});
	});

	describe('negative cases', () => {
		test('sets empty defaults when values are not provided', () => {
			render(
				<Wrapper>
					<Container values={undefined} products={[]} />
				</Wrapper>
			);

			expect(
				screen.getByTestId('update-order-default-order-id')
			).toHaveTextContent('');
			expect(
				screen.getByTestId('update-order-default-title')
			).toHaveTextContent('');
			expect(
				screen.getByTestId('update-order-default-products-selected')
			).toHaveTextContent('[]');
			expect(
				screen.getByTestId('update-order-default-location')
			).toHaveTextContent('');
		});
	});

	describe('edge cases', () => {
		test('handles products without matching selection gracefully', () => {
			const values: TOrder = {
				id: 'order-2',
				title: 'Order Without Products',
				description: null,
				date: new Date('2024-03-01T00:00:00Z'),
				amountOfProducts: 0,
				userId: 'user-2',
				products: [],
				location: null
			};
			const productOptions: { id: string; title: string | null }[] = [
				{ id: 'unrelated', title: 'Unrelated Product' }
			];

			render(
				<Wrapper>
					<Container values={values} products={productOptions} />
				</Wrapper>
			);

			expect(
				screen.getByTestId('update-order-default-products-selected')
			).toHaveTextContent('[]');

			const options = JSON.parse(
				screen.getByTestId('update-order-default-product-options')
					.textContent || '[]'
			) as OptionType[];
			expect(options).toHaveLength(1);
			expect(options[0]?.value).toBe('unrelated');
		});
	});
});
