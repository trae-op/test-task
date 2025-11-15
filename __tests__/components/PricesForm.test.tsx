import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

import { PricesForm } from '@/components/PricesForm';

jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key
}));

jest.mock('@/hooks/pricesForm/usePriceFormActions', () => ({
	usePriceFormActions: () => ({
		amount: '10',
		currency: 'USD',
		isDefault: false,
		prices: [],
		setAmount: jest.fn(),
		setCurrency: jest.fn(),
		setIsDefault: jest.fn(),
		handleAddPrice: jest.fn(),
		handlePricesChange: jest.fn()
	})
}));

type FormValues = {
	currency: { value: string; title: string }[];
};

const Wrapper = () => {
	const methods = useForm<FormValues>({
		defaultValues: { currency: [] }
	});

	return (
		<FormProvider {...methods}>
			<PricesForm />
		</FormProvider>
	);
};

describe('PricesForm', () => {
	test('renders all form fields and list', () => {
		render(<Wrapper />);

		expect(screen.getByText('Amount')).toBeInTheDocument();
		expect(screen.getByText('Currency')).toBeInTheDocument();
		expect(screen.getByText('Default')).toBeInTheDocument();
		expect(screen.getByText('Add price')).toBeInTheDocument();
		expect(screen.getByText('Prices')).toBeInTheDocument();
	});
});
