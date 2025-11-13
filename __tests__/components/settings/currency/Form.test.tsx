import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { FormCurrency } from '@/app/_conceptions/Settings/Currency/Form';

const onSubmitMock = jest.fn();
jest.mock('@/hooks/settings/currency', () => ({
	useActions: () => ({ onSubmit: onSubmitMock, state: { ok: false } })
}));

jest.mock('@/components/MessagesServer', () => ({
	MessagesServer: ({ message }: any) => (message ? <div>{message}</div> : null)
}));

describe('components/settings/currency/FormCurrency', () => {
	beforeEach(() => jest.clearAllMocks());

	const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
		const methods = useForm();
		return React.createElement(
			FormProvider as any,
			{ ...methods },
			children as any
		);
	};

	it('renders and submits with valid values', async () => {
		const user = userEvent.setup();
		render(
			<Wrapper>
				<FormCurrency />
			</Wrapper>
		);

		await user.type(screen.getByLabelText('Title'), 'US Dollar');
		await user.type(screen.getByLabelText('Value'), 'USD');

		await user.click(screen.getByRole('button', { name: 'Submit' }));

		expect(onSubmitMock).toHaveBeenCalledWith({
			title: 'US Dollar',
			value: 'USD'
		});
	});

	it('shows validation errors when empty', async () => {
		const user = userEvent.setup();
		render(
			<Wrapper>
				<FormCurrency />
			</Wrapper>
		);

		await user.click(screen.getByRole('button', { name: 'Submit' }));

		expect(await screen.findAllByText('This field is required')).toHaveLength(
			2
		);
	});
});
