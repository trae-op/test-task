import { updateProfile } from '@/actions/profile/profile';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		user: { findUnique: jest.fn(), update: jest.fn() }
	}
}));

const { getServerSession } = jest.requireMock('next-auth');
const { prisma: mockPrisma } = jest.requireMock('@/prisma/prisma-client');

describe('profile/updateProfile action', () => {
	beforeEach(() => jest.clearAllMocks());

	it('updates profile with valid input (positive)', async () => {
		(getServerSession as jest.Mock).mockResolvedValue({
			user: { email: 'a@b.com' }
		});
		mockPrisma.user.findUnique.mockResolvedValue({
			id: 'u1',
			email: 'a@b.com'
		});
		mockPrisma.user.update.mockResolvedValue({ id: 'u1' });

		const res = await updateProfile({ email: 'a@b.com', name: 'John' });
		expect(res).toEqual({ ok: true, code: 'SUCCESS' });
	});

	it('returns INVALID_INPUT on bad email (negative)', async () => {
		(getServerSession as jest.Mock).mockResolvedValue({
			user: { email: 'a@b.com' }
		});
		const res = await updateProfile({ email: 'not-an-email' });
		expect(res).toEqual({ ok: false, code: 'INVALID_INPUT' });
	});
});
