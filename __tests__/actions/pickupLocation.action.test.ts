import { deletePickupLocationById } from '@/actions/pickupLocation';

jest.mock('next/cache', () => ({
	revalidateTag: jest.fn()
}));

jest.mock('@/utils/session', () => ({
	getUserSession: jest.fn()
}));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		pickupLocation: {
			findFirst: jest.fn()
		},
		orderLocation: {
			findFirst: jest.fn()
		},
		$transaction: jest.fn()
	}
}));

const { revalidateTag } = jest.requireMock('next/cache');
const { getUserSession } = jest.requireMock('@/utils/session');
const { prisma } = jest.requireMock('@/prisma/prisma-client');

describe('actions/pickupLocation deletePickupLocationById', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const createFormData = (id?: string) => {
		const fd = new FormData();
		if (id !== undefined) fd.set('id', id);
		return fd;
	};

	it('returns UNAUTHORIZED when session missing', async () => {
		(getUserSession as jest.Mock).mockResolvedValue(null);

		const result = await deletePickupLocationById(
			{ ok: false },
			createFormData('1')
		);

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
		expect(prisma.pickupLocation.findFirst).not.toHaveBeenCalled();
	});

	it('returns ID_NOT_FOUND when id missing', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });

		const result = await deletePickupLocationById(
			{ ok: false },
			createFormData('   ')
		);

		expect(result).toEqual({ ok: false, code: 'ID_NOT_FOUND' });
		expect(prisma.pickupLocation.findFirst).not.toHaveBeenCalled();
	});

	it('returns NOT_FOUND when entity not owned by user', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		prisma.pickupLocation.findFirst.mockResolvedValue(null);

		const result = await deletePickupLocationById(
			{ ok: false },
			createFormData('loc-1')
		);

		expect(result).toEqual({ ok: false, code: 'NOT_FOUND' });
		expect(prisma.orderLocation.findFirst).not.toHaveBeenCalled();
		expect(prisma.$transaction).not.toHaveBeenCalled();
	});

	it('removes linked order location before pickup location when present', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		prisma.pickupLocation.findFirst.mockResolvedValue({
			id: 'loc-1',
			latitude: 50,
			longitude: 30,
			userId: 'user-1'
		});
		prisma.orderLocation.findFirst.mockResolvedValue({ id: 'order-1' });

		const orderDelete = jest.fn();
		const pickupDelete = jest.fn();
		prisma.$transaction.mockImplementation(
			async (callback: (tx: any) => Promise<void>) => {
				await callback({
					orderLocation: { delete: orderDelete },
					pickupLocation: { delete: pickupDelete }
				});
			}
		);

		const result = await deletePickupLocationById(
			{ ok: false },
			createFormData('loc-1')
		);

		expect(result).toEqual({ ok: true });
		expect(orderDelete).toHaveBeenCalledWith({ where: { id: 'order-1' } });
		expect(pickupDelete).toHaveBeenCalledWith({ where: { id: 'loc-1' } });
		expect(revalidateTag).toHaveBeenCalledWith('orders');
	});

	it('skips order removal when none exists', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		prisma.pickupLocation.findFirst.mockResolvedValue({
			id: 'loc-1',
			latitude: 50,
			longitude: 30,
			userId: 'user-1'
		});
		prisma.orderLocation.findFirst.mockResolvedValue(null);

		const pickupDelete = jest.fn();
		prisma.$transaction.mockImplementation(
			async (callback: (tx: any) => Promise<void>) => {
				await callback({
					orderLocation: { delete: jest.fn() },
					pickupLocation: { delete: pickupDelete }
				});
			}
		);

		const result = await deletePickupLocationById(
			{ ok: false },
			createFormData('loc-1')
		);

		expect(result).toEqual({ ok: true });
		expect(pickupDelete).toHaveBeenCalledWith({ where: { id: 'loc-1' } });
	});

	it('returns SERVER_ERROR on unexpected failure', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		prisma.pickupLocation.findFirst.mockRejectedValue(new Error('db down'));

		const result = await deletePickupLocationById(
			{ ok: false },
			createFormData('loc-1')
		);

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
		expect(revalidateTag).not.toHaveBeenCalled();
	});
});
