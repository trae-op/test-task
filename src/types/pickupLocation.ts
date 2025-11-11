import type { PickupLocation } from '@prisma/client';

export type TPickupLocation = PickupLocation;

export type TPickupLocationActionResult = {
	ok: boolean;
	code?: 'UNAUTHORIZED' | 'SERVER_ERROR';
	items?: TPickupLocation[];
};
