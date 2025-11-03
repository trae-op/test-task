import { getPictureByEntityId } from '@/actions/pictures/profile/action';

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		profilePicture: { findFirst: jest.fn() }
	}
}));
jest.mock('@/utils/session', () => ({ getUserSession: jest.fn() }));

const { getUserSession } = jest.requireMock('@/utils/session');
const { prisma: mockPrisma } = jest.requireMock('@/prisma/prisma-client');

describe('pictures/profile action', () => {
	beforeEach(() => jest.clearAllMocks());

	it('returns picture for valid id and session (positive)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'u1' });
		mockPrisma.profilePicture.findFirst.mockResolvedValue({
			id: 'pic1',
			userId: 'u1'
		});

		const res = await getPictureByEntityId('u1');
		expect(res).toEqual({ ok: true, item: { id: 'pic1', userId: 'u1' } });
	});

	it('returns MISSING_ID when id empty (negative)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'u1' });
		const res = await getPictureByEntityId('');
		expect(res).toEqual({ ok: false, code: 'MISSING_ID' });
	});
});
