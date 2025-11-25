import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

export async function getPictureByEntityId(id: string) {
	try {
		const userSession = await getUserSession();

		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		if (!id) {
			return { code: 'MISSING_ID', ok: false };
		}

		const picture = await prisma.productPicture.findFirst({
			where: { userId: userSession.id, productId: id }
		});

		if (!picture) {
			return { code: 'PICTURE_NOT_FOUND', ok: false };
		}

		return {
			ok: true,
			item: picture
		};
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}

export async function getPicturesByEntities(ids: string[]) {
	try {
		const userSession = await getUserSession();

		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		if (!ids || ids.length === 0) {
			return { code: 'MISSING_IDS', ok: false };
		}

		const pictures = await prisma.productPicture.findMany({
			where: { userId: userSession.id, productId: { in: ids } }
		});

		if (!pictures || pictures.length === 0) {
			return { code: 'PICTURES_NOT_FOUND', ok: false };
		}

		return {
			ok: true,
			items: pictures
		};
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}
