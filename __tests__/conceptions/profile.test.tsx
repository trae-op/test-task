import { render, screen } from '@testing-library/react';
import React from 'react';

// Child stubs
jest.mock('@/app/_conceptions/Profile/Info', () => ({ Info: () => <div /> }));
jest.mock('@/app/_conceptions/Profile/UpdatePassword', () => ({
	UpdatePassword: () => <div />
}));

// Session mock is mutable per test to avoid module resets (prevents React duplication)
const sessionMock: { data: any } = { data: null };
jest.mock('next-auth/react', () => ({
	useSession: () => sessionMock
}));

jest.mock('@/components/Loading', () => ({
	Loading: () => <div>Loading...</div>
}));

// Avoid invoking real auth hook (which uses React hooks and server actions)
jest.mock('@/hooks/auth', () => ({
	useAuthActions: () => ({ signOut: jest.fn() })
}));

describe('Profile container', () => {
	beforeEach(() => {
		sessionMock.data = null;
	});

	it('shows loader when session incomplete (negative)', () => {
		const { Profile } = require('@/app/_conceptions/Profile/Profile');
		render(<Profile />);
		expect(screen.getByText(/Loading/)).toBeInTheDocument();
	});

	it('renders forms when session available (positive)', () => {
		sessionMock.data = {
			user: { name: 'John', email: 'john@example.com', id: 'u1' }
		};
		const { Profile } = require('@/app/_conceptions/Profile/Profile');
		render(<Profile />);
		expect(
			screen.getByRole('button', { name: /Sign Out/i })
		).toBeInTheDocument();
	});
});
