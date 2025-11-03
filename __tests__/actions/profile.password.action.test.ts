import { updatePassword } from '@/actions/profile/password';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('bcryptjs', () => ({ compare: jest.fn(), hash: jest.fn() }));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		user: { findUnique: jest.fn(), update: jest.fn() }
	}
}));

const { getServerSession } = jest.requireMock('next-auth');
const { compare, hash } = jest.requireMock('bcryptjs');
const { prisma: mockPrisma } = jest.requireMock('@/prisma/prisma-client');

describe('profile/updatePassword action', () => {
	beforeEach(() => jest.clearAllMocks());

	it('updates password when old matches (positive)', async () => {
		(getServerSession as jest.Mock).mockResolvedValue({
			user: { email: 'a@b.com' }
		});
		mockPrisma.user.findUnique.mockResolvedValue({
			id: 'u1',
			password: 'hashed'
		});
		(compare as jest.Mock).mockResolvedValue(true);
		(hash as jest.Mock).mockResolvedValue('new-hash');

		const res = await updatePassword({
			oldPassword: 'old',
			newPassword: 'Abcdef12'
		});
		expect(res).toEqual({ ok: true });
		expect(mockPrisma.user.update).toHaveBeenCalled();
	});

	it('returns WRONG_PASSWORD when old mismatch (negative)', async () => {
		(getServerSession as jest.Mock).mockResolvedValue({
			user: { email: 'a@b.com' }
		});
		mockPrisma.user.findUnique.mockResolvedValue({
			id: 'u1',
			password: 'hashed'
		});
		(compare as jest.Mock).mockResolvedValue(false);

		const res = await updatePassword({
			oldPassword: 'bad',
			newPassword: 'Abcdef12'
		});
		expect(res).toEqual({ ok: false, code: 'WRONG_PASSWORD' });
	});
});
