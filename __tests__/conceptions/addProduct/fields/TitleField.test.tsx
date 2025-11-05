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

		// Label should be present
		expect(screen.getByText('Title')).toBeInTheDocument();

		// Trigger blur without entering a value to validate required
		const input = screen.getByPlaceholderText('Enter title');
		fireEvent.blur(input);

		// Error message should appear from next-intl mock
		expect(await screen.findByText('required')).toBeInTheDocument();
	});
});
