import { act, renderHook } from '@testing-library/react';

import { usePasswordActions } from '@/hooks/profile/usePasswordActions';
import { useProfileActions } from '@/hooks/profile/useProfileActions';

// Mock React hooks to control useActionState and startTransition
let formActionMock: jest.Mock<any, any>;
let useActionStateState: any;
jest.mock('react', () => {
	const actual = jest.requireActual('react');
	return {
		...actual,
		useActionState: (_fn: any, initial: any) => {
			formActionMock = jest.fn();
			return [useActionStateState ?? initial, formActionMock, false];
		},
		startTransition: (cb: any) => cb()
	};
});

// avoid importing server action internals used by these hooks
jest.mock('@/actions/profile/passwordSubmit', () => ({
	passwordSubmit: jest.fn()
}));
jest.mock('@/actions/profile/profileSubmit', () => ({
	profileSubmit: jest.fn()
}));

const mockUpdate = jest.fn();
jest.mock('next-auth/react', () => ({
	useSession: () => ({
		data: { user: { email: 'user@old.com', name: 'Old' } },
		update: mockUpdate
	})
}));

describe('profile hooks', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('usePasswordActions: builds FormData and dispatches', () => {
		useActionStateState = { ok: false };
		const { result } = renderHook(() => usePasswordActions());

		act(() => {
			result.current.onPasswordSubmit(
				{ oldPassword: 'old', newPassword: 'new', confirmPassword: 'new' },
				'en'
			);
		});

		expect(formActionMock).toHaveBeenCalledTimes(1);
		const fd = formActionMock.mock.calls[0][0] as FormData;
		const keys = Array.from((fd as any).keys?.() ?? []);
		expect(keys).toEqual(
			expect.arrayContaining(['oldPassword', 'newPassword', 'locale'])
		);
	});

	it('useProfileActions: submits and updates session when state.ok becomes true', () => {
		// First render state
		useActionStateState = { ok: false } as any;
		const { result, rerender } = renderHook(() => useProfileActions());
		const initialFormAction = formActionMock;

		act(() => {
			result.current.onProfileSubmit(
				{ id: 'u1', name: 'John', email: 'new@example.com' },
				'en'
			);
		});

		// Cause state.ok change to true
		useActionStateState = { ok: true } as any;
		rerender();

		expect(initialFormAction).toHaveBeenCalledTimes(1);
		expect(mockUpdate).toHaveBeenCalledWith({
			email: 'new@example.com',
			name: 'John'
		});
	});
});
