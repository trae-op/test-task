import { render, screen } from '@testing-library/react';
import React from 'react';

const infoRenderSpy = jest.fn();

const MockInfoComponent = (props: any) => {
	infoRenderSpy(props);
	return <div data-testid='profile-info' />;
};

jest.mock('@/app/_conceptions/Profile/Info', () => ({
	Info: MockInfoComponent
}));
jest.mock('@/app/_conceptions/Profile/UpdatePassword', () => ({
	UpdatePassword: () => <div data-testid='profile-update-password' />
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
		infoRenderSpy.mockClear();
	});

	it('hides info when session incomplete (negative)', () => {
		const { Profile } = require('@/app/_conceptions/Profile/Profile');
		render(<Profile />);
		expect(screen.queryByTestId('profile-info')).not.toBeInTheDocument();
		expect(infoRenderSpy).not.toHaveBeenCalled();
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
		expect(screen.getByTestId('profile-info')).toBeInTheDocument();
		expect(infoRenderSpy).toHaveBeenCalledWith({
			name: 'John',
			id: 'u1',
			email: 'john@example.com'
		});
	});
});
