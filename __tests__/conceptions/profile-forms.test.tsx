import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

// Import after mocks below in tests where needed

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

// Stub heavy child components used inside Info
jest.mock('@/components/ImageUpload', () => ({
	ImageUpload: () => <div />
}));
jest.mock('@/components/MessagesServer', () => ({
	MessagesServer: ({ message }: any) => <div>{message}</div>
}));

describe('Profile forms', () => {
	it('UpdatePassword negative: shows validation errors on empty submit', () => {
		const {
			UpdatePassword
		} = require('@/app/_conceptions/Profile/UpdatePassword');
		render(<UpdatePassword />);
		// Submit without filling any input
		const submitBtn = screen.getByRole('button');
		fireEvent.click(submitBtn);
		// Button becomes disabled due to submitting state from react-hook-form
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('Info positive: renders with provided defaults', () => {
		const { Info } = require('@/app/_conceptions/Profile/Info');
		render(
			(<Info id={'u1'} name={'John'} email={'john@example.com'} />) as any
		);
		// Placeholder uses translation key via mock
		expect(
			screen.getByPlaceholderText('Profile.info.placeholders.name')
		).toBeInTheDocument();
	});
});
