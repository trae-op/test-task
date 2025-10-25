import { type NextRequest, NextResponse } from 'next/server';

import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

type TParams = {
	entityId: string;
};

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<TParams> }
) => {
	try {
		const { entityId: id } = await params;
		const userSession = await getUserSession();
		if (userSession === null) {
			return NextResponse.json(
				{ code: 'UNAUTHORIZED', ok: false },
				{ status: 401 }
			);
		}
		if (!id) {
			return NextResponse.json(
				{ message: 'ID_NOT_FOUND', ok: false },
				{ status: 400 }
			);
		}
		const order = await prisma.order.findFirst({
			where: { id, userId: userSession.id },
			include: { products: true }
		});
		if (!order?.products) {
			return NextResponse.json(
				{ message: 'PRODUCTS_NOT_FOUND', ok: false },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{
				items: order.products.map(
					({ title, photo, serialNumber, id, isNew }) => ({
						title,
						photo,
						serialNumber,
						id,
						isNew
					})
				)
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'SERVER_ERROR', ok: false },
			{ status: 500 }
		);
	}
};
