import ImageKit from 'imagekit';
import { getLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { TProduct } from '@/types/products';

import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

const imageKit = new ImageKit({
	publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
	privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
	urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_URL || ''
});

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

		const productPicture = await prisma.productPicture.findFirst({
			where: { productId: id, userId: userSession.id }
		});

		if (productPicture) {
			await prisma.productPicture.delete({
				where: {
					id: productPicture.id,
					userId: userSession.id,
					productId: id
				}
			});

			await imageKit.deleteFile(productPicture.pictureId);
		}

		await prisma.product.delete({ where: { id } });

		const locale = await getLocale();
		revalidatePath(`/${locale}/products`);

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
				message: 'Something wrong with the server!',
				ok: false
			},
			{
				status: 500
			}
		);
	}
};
