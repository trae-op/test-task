import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { TProduct } from '@/types/products';

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

		const product = await prisma.product.findUnique({
			where: { id, userId: userSession.id }
		});
		if (!product) {
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

		await prisma.product.delete({ where: { id } });

		revalidatePath('/[locale]/products');

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
		const fieldsParam = searchParams.get('fields');

		// Parse fields as array of keys
		const fields = fieldsParam
			? (fieldsParam.split(',') as Array<keyof TProduct>)
			: undefined;

		// Build Prisma query
		const where: Record<string, any> = {};
		if (id) where.id = id;
		if (type) where.type = type;

		// Include related products and prices
		const entities = await prisma.product.findMany({
			where,
			include: { order: true, prices: true }
		});

		// Filter fields if specified
		let result: Partial<TProduct>[] = entities.map(entity => ({
			...entity,
			order: entity.order ?? undefined
		}));
		if (fields && fields.length) {
			result = entities.map(entity => {
				const filtered:
					| TProduct
					| {
							[key: string]: TProduct[keyof TProduct];
					  } = {};
				fields.forEach(key => {
					if (key in entity) {
						filtered[key] = (entity as TProduct)[key];
					}
				});
				return filtered;
			});
		}

		return NextResponse.json({ ok: true, items: result }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ ok: false, message: 'SERVER_ERROR' },
			{ status: 500 }
		);
	}
};
