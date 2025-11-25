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

		const picture = await prisma.profilePicture.findFirst({
			where: { userId: id }
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
