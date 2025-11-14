import { signUp } from '@/app/_conceptions/Auth/actions/action';

jest.mock('bcryptjs', () => ({ compare: jest.fn(), hash: jest.fn() }));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() }
	}
}));

const { hash } = jest.requireMock('bcryptjs');
const { prisma: mockPrisma } = jest.requireMock('@/prisma/prisma-client');

describe('auth/signUp action', () => {
	beforeEach(() => jest.clearAllMocks());

	it('creates new user when not existing (positive)', async () => {
		mockPrisma.user.findUnique.mockResolvedValue(null);
		(hash as jest.Mock).mockResolvedValue('hash');
		mockPrisma.user.create.mockResolvedValue({ id: 'u1' });

		const res = await signUp({ email: 'a@b.com', password: 'Abcdef12' });
		expect(res).toEqual({ ok: true, userId: 'u1' });
	});

	it('returns WEAK_PASSWORD on invalid password (negative)', async () => {
		const res = await signUp({ email: 'a@b.com', password: 'short' });
		expect(res).toEqual({ ok: false, code: 'WEAK_PASSWORD' });
	});
});
