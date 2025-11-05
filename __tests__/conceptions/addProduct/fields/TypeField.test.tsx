import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { TypeField } from '@/app/_conceptions/AddProduct/fields/TypeField';

type TForm = { type?: string };

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const methods = useForm<TForm>({
		mode: 'onSubmit',
		defaultValues: { type: '' }
	});
	return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('AddProduct fields/TypeField', () => {
	it('should render label and allow selecting a type', () => {
		render(
			<Wrapper>
				<TypeField
					typeOptions={[
						{ value: 'phone', label: 'Phone' },
						{ value: 'laptop', label: 'Laptop' }
					]}
				/>
			</Wrapper>
		);

		const select = screen.getByLabelText('Type') as HTMLSelectElement;
		expect(select).toBeInTheDocument();

		// Placeholder exists as hidden option; change to a real value
		fireEvent.change(select, { target: { value: 'laptop' } });
		expect(select.value).toBe('laptop');
	});
});
