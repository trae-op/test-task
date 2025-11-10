import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { PricesForm } from '@/components/PricesForm/PricesForm';

const inspectedMultiSelect = (props: any) => (
	<div data-testid='multi' data-value={JSON.stringify(props.value)} />
);

jest.mock('@/components/MultiSelectField', () => ({
	MultiSelectField: inspectedMultiSelect
}));

const dynamicMultiSelect = () => {
	return function DynamicMock(props: any) {
		const { MultiSelectField } = require('@/components/MultiSelectField');
		return <MultiSelectField {...props} />;
	};
};

jest.mock('next/dynamic', () => dynamicMultiSelect);

const Wrapper: React.FC<{ children: React.ReactNode; defaultValues?: any }> = ({
	children,
	defaultValues
}) => {
	const methods = useForm({
		defaultValues: defaultValues ?? { prices: [], currency: [] }
	});
	return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('components/PricesForm', () => {
	const currencyOptions = [
		{ value: 'USD', title: 'USD' },
		{ value: 'EUR', title: 'EUR' }
	];

	it('adds a default price and reflects it in the list', () => {
		render(
			<Wrapper defaultValues={{ prices: [], currency: currencyOptions }}>
				<PricesForm />
			</Wrapper>
		);

		const amount = screen.getByPlaceholderText('0.00') as HTMLInputElement;
		fireEvent.change(amount, { target: { value: '10' } });

		const select = screen.getByLabelText('Currency') as HTMLSelectElement;
		fireEvent.change(select, { target: { value: 'USD' } });

		const checkbox = screen.getByLabelText('Default') as HTMLInputElement;
		fireEvent.click(checkbox);

		fireEvent.click(screen.getByRole('button', { name: 'Add price' }));

		const multi = screen.getByTestId('multi');
		const value = JSON.parse(multi.getAttribute('data-value') || '[]');
		expect(value).toHaveLength(1);
		expect(value[0].value).toBe('USD');
		expect(value[0].isDefault).toBe(true);
		expect(value[0].valueAmount).toBe(10);

		const usdOption = Array.from(select.options).find(o => o.value === 'USD');
		expect(usdOption?.disabled).toBe(true);
	});

	it('replaces price for the same currency and resets default when new is not default', () => {
		render(
			<Wrapper defaultValues={{ prices: [], currency: currencyOptions }}>
				<PricesForm />
			</Wrapper>
		);

		const amount = screen.getByPlaceholderText('0.00') as HTMLInputElement;
		const select = screen.getByLabelText('Currency') as HTMLSelectElement;
		const checkbox = screen.getByLabelText('Default') as HTMLInputElement;

		fireEvent.change(amount, { target: { value: '10' } });
		fireEvent.change(select, { target: { value: 'USD' } });
		fireEvent.click(checkbox);
		fireEvent.click(screen.getByRole('button', { name: 'Add price' }));

		fireEvent.change(amount, { target: { value: '5' } });
		if (checkbox.checked) fireEvent.click(checkbox);
		fireEvent.click(screen.getByRole('button', { name: 'Add price' }));

		const multi = screen.getByTestId('multi');
		const value = JSON.parse(multi.getAttribute('data-value') || '[]');
		expect(value).toHaveLength(1);
		expect(value[0].value).toBe('USD');
		expect(value[0].isDefault).toBe(false);
		expect(value[0].valueAmount).toBe(5);
	});
});
