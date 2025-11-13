import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { FormProductType } from '@/app/_conceptions/Settings/ProductType/Form';

const onSubmitMock = jest.fn();
jest.mock('@/hooks/settings/productType', () => ({
	useActions: () => ({ onSubmit: onSubmitMock, state: { ok: false } })
}));

jest.mock('@/components/MessagesServer', () => ({
	MessagesServer: ({ message }: any) => (message ? <div>{message}</div> : null)
}));

describe('components/settings/productType/FormProductType', () => {
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
				<FormProductType />
			</Wrapper>
		);

		await user.type(screen.getByLabelText('Title'), 'Hardware');
		await user.type(screen.getByLabelText('Value'), 'hardware');

		await user.click(screen.getByRole('button', { name: 'Submit' }));

		expect(onSubmitMock).toHaveBeenCalledWith({
			title: 'Hardware',
			value: 'hardware'
		});
	});

	it('shows validation errors when empty', async () => {
		const user = userEvent.setup();
		render(
			<Wrapper>
				<FormProductType />
			</Wrapper>
		);

		await user.click(screen.getByRole('button', { name: 'Submit' }));

		expect(await screen.findAllByText('This field is required')).toHaveLength(
			2
		);
	});
});
