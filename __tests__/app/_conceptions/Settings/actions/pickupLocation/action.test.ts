import { revalidateTag } from 'next/cache';

import { getUserSession } from '@/utils/session';

import {
	addPickupLocation,
	deletePickupLocationById,
	getPickupLocations
} from '@/app/_conceptions/Settings/actions/pickupLocation/action';
import { prisma } from '@/prisma/prisma-client';

jest.mock('next/cache', () => ({
	revalidateTag: jest.fn()
}));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		pickupLocation: {
			findMany: jest.fn(),
			create: jest.fn(),
			findFirst: jest.fn()
		},
		orderLocation: {
			findFirst: jest.fn(),
			delete: jest.fn()
		},
		$transaction: jest.fn(async fn =>
			fn({
				pickupLocation: { delete: jest.fn() },
				orderLocation: { delete: jest.fn() }
			})
		)
	}
}));

jest.mock('@/utils/session', () => ({
	getUserSession: jest.fn()
}));

describe('Settings pickupLocation actions', () => {
	test('getPickupLocations returns UNAUTHORIZED without session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const result = await getPickupLocations();

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('getPickupLocations returns items', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		const items = [{ id: 'p1' }];
		(prisma.pickupLocation.findMany as jest.Mock).mockResolvedValueOnce(items);

		const result = await getPickupLocations();

		expect(prisma.pickupLocation.findMany).toHaveBeenCalledWith({
			where: { userId: 'user-1' },
			orderBy: { id: 'desc' }
		});
		expect(result).toEqual({ ok: true, items });
	});

	test('getPickupLocations returns SERVER_ERROR on error', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.pickupLocation.findMany as jest.Mock).mockRejectedValueOnce(
			new Error('db')
		);

		const result = await getPickupLocations();

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});

	test('addPickupLocation returns UNAUTHORIZED without session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const result = await addPickupLocation({
			lat: 1,
			lng: 2
		});

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('addPickupLocation returns INVALID_INPUT for invalid coords', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });

		const result = await addPickupLocation({
			lat: Number.NaN,
			lng: 2
		});

		expect(result).toEqual({ ok: false, code: 'INVALID_INPUT' });
	});

	test('addPickupLocation creates item', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		const item = { id: 'p1', latitude: 1, longitude: 2 };
		(prisma.pickupLocation.create as jest.Mock).mockResolvedValueOnce(item);

		const result = await addPickupLocation({
			lat: 1,
			lng: 2,
			city: ' City '
		});

		expect(prisma.pickupLocation.create).toHaveBeenCalled();
		expect(result).toEqual({ ok: true, item });
	});

	test('addPickupLocation returns SERVER_ERROR on error', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.pickupLocation.create as jest.Mock).mockRejectedValueOnce(
			new Error('db')
		);

		const result = await addPickupLocation({ lat: 1, lng: 2 });

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});

	test('deletePickupLocationById returns UNAUTHORIZED without session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const formData = new FormData();
		formData.set('id', '1');

		const result = await deletePickupLocationById({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('deletePickupLocationById returns ID_NOT_FOUND when missing id', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });

		const formData = new FormData();
		formData.set('id', '');

		const result = await deletePickupLocationById({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'ID_NOT_FOUND' });
	});

	test('deletePickupLocationById returns NOT_FOUND when entity missing', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.pickupLocation.findFirst as jest.Mock).mockResolvedValueOnce(null);

		const formData = new FormData();
		formData.set('id', '1');

		const result = await deletePickupLocationById({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'NOT_FOUND' });
	});

	test('deletePickupLocationById deletes entity and revalidates', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.pickupLocation.findFirst as jest.Mock).mockResolvedValueOnce({
			id: '1',
			latitude: 1,
			longitude: 2,
			userId: 'user-1'
		});
		(prisma.orderLocation.findFirst as jest.Mock).mockResolvedValueOnce({
			id: 'ol1'
		});

		const formData = new FormData();
		formData.set('id', '1');

		const result = await deletePickupLocationById({ ok: false }, formData);

		expect(result).toEqual({ ok: true });
		expect(revalidateTag).toHaveBeenCalledWith('orders');
	});

	test('deletePickupLocationById returns SERVER_ERROR on error', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.pickupLocation.findFirst as jest.Mock).mockRejectedValueOnce(
			new Error('db')
		);

		const formData = new FormData();
		formData.set('id', '1');

		const result = await deletePickupLocationById({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});
});
