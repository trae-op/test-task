import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { type TOrder } from '@/types/orders';

import { calculateOrderTotals } from '@/utils/orders';
import { parseQueryParams } from '@/utils/routing/routing';
import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

export const DELETE = async (req: NextRequest) => {
	try {
		const searchParams = req.nextUrl.searchParams;
		const id = searchParams.get('id');

		const userSession = await getUserSession();

		if (userSession === null) {
			return NextResponse.json(
				{
					code: 'UNAUTHORIZED',
					ok: false
				},
				{
					status: 401
				}
			);
		}

		if (id === null) {
			return NextResponse.json(
				{
					message: 'ID_NOT_FOUND',
					ok: false
				},
				{
					status: 400
				}
			);
		}

		const order = await prisma.order.findUnique({
			where: { id, userId: userSession.id }
		});
		if (!order) {
			return NextResponse.json(
				{
					message: 'NOT_FOUND',
					ok: false
				},
				{
					status: 404
				}
			);
		}

		await prisma.order.delete({ where: { id } });

		revalidatePath('/[locale]/orders');

		return NextResponse.json(
			{
				message: 'SUCCESS_DELETE',
				ok: true
			},
			{
				status: 200
			}
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: 'SERVER_ERROR',
				ok: false
			},
			{
				status: 500
			}
		);
	}
};

export const GET = async (req: NextRequest) => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) {
			return NextResponse.json(
				{ code: 'UNAUTHORIZED', ok: false },
				{ status: 401 }
			);
		}

		const searchParams = req.nextUrl.searchParams;
		const id = searchParams.get('id');
		const type = searchParams.get('type');
		const where: Record<string, any> = {};
		if (id) where.id = id;
		if (type) where.type = type;

		const paramsArr: string[] = [];
		for (const [key, value] of searchParams.entries()) {
			if (value !== null && value !== '' && /fields/.test(key)) {
				paramsArr.push(`${key}=${value}`);
			}
		}

		const queryString = paramsArr.join('&');
		const select = parseQueryParams(queryString);

		const entities = await prisma.order.findMany({
			...(Object.keys(select).length
				? {
						select
					}
				: {}),
			where: {
				...where,
				userId: userSession.id
			}
		});

		return NextResponse.json(
			{
				ok: true,
				items: calculateOrderTotals(
					entities.map((item: TOrder) => ({
						...item,
						amountOfProducts: item.products ? item.products.length : 0
					}))
				)
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ ok: false, message: 'SERVER_ERROR' },
			{ status: 500 }
		);
	}
};
