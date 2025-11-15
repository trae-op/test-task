import { getServerSession } from 'next-auth';

import { getUserSession } from '@/utils/session';

jest.mock('next-auth', () => ({
	getServerSession: jest.fn()
}));

const mockedGetServerSession = getServerSession as jest.MockedFunction<
	typeof getServerSession
>;

describe('getUserSession', () => {
	test('returns user from session when present', async () => {
		mockedGetServerSession.mockResolvedValue({
			user: { id: '1', name: 'User' }
		} as any);
		const user = await getUserSession();
		expect(user).toEqual({ id: '1', name: 'User' });
	});

	test('returns null when no session', async () => {
		mockedGetServerSession.mockResolvedValue(null as any);
		const user = await getUserSession();
		expect(user).toBeNull();
	});
});
