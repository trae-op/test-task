import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

jest.mock('@/hooks/profile/usePasswordActions', () => ({
	usePasswordActions: () => ({
		onPasswordSubmit: jest.fn(),
		state: { message: '' },
		isPending: false
	})
}));
jest.mock('@/hooks/profile/useProfileActions', () => ({
	useProfileActions: () => ({
		onProfileSubmit: jest.fn(),
		state: { message: '' },
		isPending: false
	})
}));

jest.mock('next-auth/react', () => ({
	useSession: () => ({ data: { user: { id: 'u1' } } })
}));

jest.mock('@/context/global/useContext', () => ({
	useSetAvatarProfileDispatch: () => jest.fn()
}));

const LightweightImageUpload = () => <div />;
const MessagesPreview = ({ message }: any) => <div>{message}</div>;

jest.mock('@/components/ImageUpload', () => ({
	ImageUpload: LightweightImageUpload
}));
jest.mock('@/components/MessagesServer', () => ({
	MessagesServer: MessagesPreview
}));

describe('Profile forms', () => {
	it('UpdatePassword negative: shows validation errors on empty submit', async () => {
		const {
			UpdatePassword
		} = require('@/app/_conceptions/Profile/UpdatePassword');
		render(<UpdatePassword />);
		const submitBtn = screen.getByRole('button');
		const user = userEvent.setup();
		await user.click(submitBtn);
		const errors = await screen.findAllByText('This field is required');
		expect(errors).toHaveLength(3);
	});

	it('Info positive: renders with provided defaults', () => {
		const { Info } = require('@/app/_conceptions/Profile/Info');
		render(
			(<Info id={'u1'} name={'John'} email={'john@example.com'} />) as any
		);
		expect(
			screen.getByPlaceholderText('Profile.info.placeholders.name')
		).toBeInTheDocument();
	});
});
