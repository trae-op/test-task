import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { PricesForm } from '@/components/PricesForm/PricesForm';

// Mock MultiSelectField used inside ListField dynamic import to an inspectable component
jest.mock('@/components/MultiSelectField', () => ({
	MultiSelectField: (props: any) => (
		<div data-testid='multi' data-value={JSON.stringify(props.value)} />
	)
}));

// Force next/dynamic to synchronously render the mocked MultiSelectField
jest.mock('next/dynamic', () => (loader: any) => {
	return function DynamicMock(props: any) {
		// Always use our mocked component export
		const { MultiSelectField } = require('@/components/MultiSelectField');
		return <MultiSelectField {...props} />;
	};
});

const Wrapper: React.FC<{ children: React.ReactNode; defaultValues?: any }> = ({
	children,
	defaultValues
}) => {
	const methods = useForm({ defaultValues: defaultValues ?? { prices: [] } });
	return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('components/PricesForm', () => {
	const currencyOptions = [
		{ value: 'USD', label: 'USD' },
		{ value: 'EUR', label: 'EUR' }
	];

	it('adds a default price and reflects it in the list', () => {
		render(
			<Wrapper>
				<PricesForm currencyOptions={currencyOptions} />
			</Wrapper>
		);

		// enter amount
		const amount = screen.getByPlaceholderText('0.00') as HTMLInputElement;
		fireEvent.change(amount, { target: { value: '10' } });

		// select currency
		const select = screen.getByLabelText('Currency') as HTMLSelectElement;
		fireEvent.change(select, { target: { value: 'USD' } });

		// set default checkbox
		const checkbox = screen.getByLabelText('Default') as HTMLInputElement;
		fireEvent.click(checkbox);

		// add price
		fireEvent.click(screen.getByRole('button', { name: 'Add price' }));

		// List should contain one price (via mocked component value prop)
		const multi = screen.getByTestId('multi');
		const value = JSON.parse(multi.getAttribute('data-value') || '[]');
		expect(value).toHaveLength(1);
		expect(value[0].value).toBe('USD');
		expect(value[0].isDefault).toBe(true);
		expect(value[0].valueAmount).toBe(10);

		// Currency option USD should be disabled now
		const usdOption = Array.from(select.options).find(o => o.value === 'USD');
		expect(usdOption?.disabled).toBe(true);
	});

	it('replaces price for the same currency and resets default when new is not default', () => {
		render(
			<Wrapper>
				<PricesForm currencyOptions={currencyOptions} />
			</Wrapper>
		);

		const amount = screen.getByPlaceholderText('0.00') as HTMLInputElement;
		const select = screen.getByLabelText('Currency') as HTMLSelectElement;
		const checkbox = screen.getByLabelText('Default') as HTMLInputElement;

		// add default USD 10
		fireEvent.change(amount, { target: { value: '10' } });
		fireEvent.change(select, { target: { value: 'USD' } });
		fireEvent.click(checkbox);
		fireEvent.click(screen.getByRole('button', { name: 'Add price' }));

		// add non-default USD 5 (should replace)
		fireEvent.change(amount, { target: { value: '5' } });
		// currency already USD
		if (checkbox.checked) fireEvent.click(checkbox); // uncheck default
		fireEvent.click(screen.getByRole('button', { name: 'Add price' }));

		const multi = screen.getByTestId('multi');
		const value = JSON.parse(multi.getAttribute('data-value') || '[]');
		expect(value).toHaveLength(1);
		expect(value[0].value).toBe('USD');
		expect(value[0].isDefault).toBe(false);
		expect(value[0].valueAmount).toBe(5);
	});
});
