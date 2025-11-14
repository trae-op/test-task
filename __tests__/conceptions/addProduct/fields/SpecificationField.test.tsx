import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { SpecificationField } from '@/app/_conceptions/AddProduct/components/fields/SpecificationField';

type TForm = { specification?: string };

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const methods = useForm<TForm>({ defaultValues: { specification: '' } });
	return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('AddProduct fields/SpecificationField', () => {
	it('should render label and allow typing specification', () => {
		render(
			<Wrapper>
				<SpecificationField />
			</Wrapper>
		);

		expect(screen.getByText('Specification')).toBeInTheDocument();
		const textarea = screen.getByPlaceholderText(
			'Enter specification'
		) as HTMLTextAreaElement;
		fireEvent.change(textarea, { target: { value: 'Specs here' } });
		expect(textarea.value).toBe('Specs here');
	});
});
