import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { TypeField } from '@/app/_conceptions/AddProduct/fields/TypeField';

type TForm = { type?: string };

const Wrapper: React.FC<
	{ children: React.ReactNode } & {
		productType?: Array<{ id: string; value: string; title: string }>;
	}
> = ({ children, productType }) => {
	const methods = useForm<
		TForm & {
			productType?: Array<{ id: string; value: string; title: string }>;
		}
	>({
		mode: 'onSubmit',
		defaultValues: { type: '', productType }
	} as any);
	return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('AddProduct fields/TypeField', () => {
	it('should render label and allow selecting a type', () => {
		render(
			<Wrapper
				productType={[
					{ id: '1', value: 'phone', title: 'Phone' },
					{ id: '2', value: 'laptop', title: 'Laptop' }
				]}
			>
				<TypeField />
			</Wrapper>
		);

		const select = screen.getByLabelText('Type') as HTMLSelectElement;
		expect(select).toBeInTheDocument();

		fireEvent.change(select, { target: { value: 'laptop' } });
		expect(select.value).toBe('laptop');
	});
});
