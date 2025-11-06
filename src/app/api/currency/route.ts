import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

export const DELETE = async (req: NextRequest) => {
	try {
		const searchParams = req.nextUrl.searchParams;
		const id = searchParams.get('id');

		const userSession = await getUserSession();
		if (userSession === null) {
			return NextResponse.json(
				{ code: 'UNAUTHORIZED', ok: false },
				{ status: 401 }
			);
		}

		if (id === null) {
			return NextResponse.json(
				{ message: 'ID_NOT_FOUND', ok: false },
				{ status: 400 }
			);
		}

		const entity = await prisma.currency.findUnique({ where: { id } });
		if (!entity) {
			return NextResponse.json(
				{ message: 'NOT_FOUND', ok: false },
				{ status: 404 }
			);
		}

		await prisma.currency.delete({ where: { id } });

		revalidatePath('/[locale]/settings');

		return NextResponse.json(
			{ message: 'SUCCESS_DELETE', ok: true },
			{ status: 200 }
		);
	} catch {
		return NextResponse.json(
			{ message: 'SERVER_ERROR', ok: false },
			{ status: 500 }
		);
	}
};
