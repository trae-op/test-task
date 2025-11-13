import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { TitleField } from '@/app/_conceptions/AddProduct/fields/TitleField';

type TForm = { title: string };

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const methods = useForm<TForm>({
		mode: 'onBlur',
		defaultValues: { title: '' }
	});
	return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('AddProduct fields/TitleField', () => {
	it('should render label and validate required on submit', async () => {
		render(
			<Wrapper>
				<form>
					<TitleField />
				</form>
			</Wrapper>
		);

		expect(screen.getByText('Title')).toBeInTheDocument();

		const input = screen.getByPlaceholderText('Enter title');
		fireEvent.blur(input);

		expect(
			await screen.findByText('This field is required')
		).toBeInTheDocument();
	});
});
