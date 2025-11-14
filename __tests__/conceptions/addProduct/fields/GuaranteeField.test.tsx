import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { GuaranteeEndField } from '@/app/_conceptions/AddProduct/components/fields/GuaranteeEndField';
import { GuaranteeStartField } from '@/app/_conceptions/AddProduct/components/fields/GuaranteeStartField';

type TForm = { guaranteeStart?: string; guaranteeEnd?: string };

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const methods = useForm<TForm>({
		mode: 'onBlur',
		defaultValues: { guaranteeStart: '', guaranteeEnd: '' }
	});
	return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('AddProduct fields/Guarantee fields', () => {
	it('should render start and end labels', () => {
		render(
			<Wrapper>
				<GuaranteeStartField />
				<GuaranteeEndField />
			</Wrapper>
		);
		expect(screen.getByText('Guarantee start')).toBeInTheDocument();
		expect(screen.getByText('Guarantee end')).toBeInTheDocument();
	});

	it('should validate that end date is not before start date', async () => {
		render(
			<Wrapper>
				<GuaranteeStartField />
				<GuaranteeEndField />
			</Wrapper>
		);

		const startInput = screen.getByLabelText(
			'Guarantee start'
		) as HTMLInputElement;
		const endInput = screen.getByLabelText('Guarantee end') as HTMLInputElement;

		fireEvent.change(startInput, { target: { value: '2024-01-10' } });
		fireEvent.change(endInput, { target: { value: '2024-01-01' } });
		fireEvent.blur(endInput);

		expect(
			await screen.findByText('End date must be after start date')
		).toBeInTheDocument();
	});
});
