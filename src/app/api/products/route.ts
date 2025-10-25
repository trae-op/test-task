import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

export const GET = async (req: NextRequest) => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) {
			return NextResponse.json(
				{ code: 'UNAUTHORIZED', ok: false },
				{ status: 401 }
			);
		}
		const products = await prisma.product.findMany({
			where: { userId: userSession.id }
		});
		return NextResponse.json({ ok: true, products }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'SERVER_ERROR', ok: false },
			{ status: 500 }
		);
	}
};

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
