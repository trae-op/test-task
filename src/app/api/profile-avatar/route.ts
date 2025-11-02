import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

export const POST = async (req: NextRequest) => {
	try {
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

		const formData = await req.formData();
		const ava = formData.get('ava') as string;

		const response = await prisma.user.update({
			where: { id: userSession.id },
			data: {
				ava
			}
		});

		return NextResponse.json(
			{
				ava: response.ava || '',
				ok: true
			},
			{
				status: 200
			}
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: 'Something wrong!',
				ok: false
			},
			{
				status: 500
			}
		);
	}
};
