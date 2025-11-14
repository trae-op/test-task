'use server';

import { revalidateTag } from 'next/cache';

import { getUserSession } from '@/utils/session';

import type {
	TAddPickupLocationInput,
	TAddPickupLocationResult,
	TDeletePickupLocationState,
	TGetPickupLocationsResult
} from './types';
import { prisma } from '@/prisma/prisma-client';

const normalizeString = (value?: string | null) => {
	if (value === undefined || value === null) return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
};

export const getPickupLocations =
	async (): Promise<TGetPickupLocationsResult> => {
		try {
			const userSession = await getUserSession();
			if (userSession === null) {
				return { ok: false, code: 'UNAUTHORIZED' };
			}

			const items = await prisma.pickupLocation.findMany({
				where: { userId: userSession.id },
				orderBy: { id: 'desc' }
			});

			return { ok: true, items };
		} catch {
			return { ok: false, code: 'SERVER_ERROR' };
		}
	};

export const addPickupLocation = async (
	input: TAddPickupLocationInput
): Promise<TAddPickupLocationResult> => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		const { lat, lng } = input;
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
			return { ok: false, code: 'INVALID_INPUT' };
		}

		const item = await prisma.pickupLocation.create({
			data: {
				latitude: lat,
				longitude: lng,
				country: normalizeString(input.country),
				state: normalizeString(input.state),
				city: normalizeString(input.city),
				district: normalizeString(input.district),
				street: normalizeString(input.street),
				postcode: normalizeString(input.postcode),
				displayName: normalizeString(input.displayName),
				userId: userSession.id
			}
		});

		return { ok: true, item };
	} catch {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};

export const deletePickupLocationById = async (
	_prevState: TDeletePickupLocationState,
	formData: FormData
): Promise<TDeletePickupLocationState> => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		const id = String(formData.get('id') ?? '').trim();
		if (!id) {
			return { ok: false, code: 'ID_NOT_FOUND' };
		}

		const entity = await prisma.pickupLocation.findFirst({
			where: { id, userId: userSession.id }
		});
		if (!entity) {
			return { ok: false, code: 'NOT_FOUND' };
		}

		const orderLocation = await prisma.orderLocation.findFirst({
			where: {
				userId: userSession.id,
				latitude: entity.latitude,
				longitude: entity.longitude
			}
		});

		await prisma.$transaction(async tx => {
			if (orderLocation) {
				await tx.orderLocation.delete({ where: { id: orderLocation.id } });
			}

			await tx.pickupLocation.delete({ where: { id: entity.id } });
		});
		revalidateTag('orders');

		return { ok: true };
	} catch {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
