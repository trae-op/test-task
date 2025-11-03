import ImageKit from 'imagekit';
import { NextRequest, NextResponse } from 'next/server';

import { TImageOptions } from '@/types/imageUpload';

import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

const imageKit = new ImageKit({
	publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
	privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
	urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_URL || ''
});

export const config = {
	api: {
		bodyParser: false
	}
};

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
		const file = formData.get('file') as Blob | null;
		const imageOptions = formData.get('imageOptions') as string | null;

		if (file === null) {
			return NextResponse.json(
				{ message: 'No file uploaded', ok: false },
				{ status: 400 }
			);
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64String = buffer.toString('base64');

		if (imageOptions === null) {
			return NextResponse.json(
				{ message: 'No image options provided', ok: false },
				{ status: 400 }
			);
		}

		const { fileName, folder, entityId } = JSON.parse(
			imageOptions
		) as TImageOptions;

		if (entityId) {
			const foundPicture = await prisma.profilePicture.findFirst({
				where: { userId: entityId }
			});

			if (foundPicture !== null) {
				await prisma.profilePicture.delete({
					where: { id: foundPicture.id, userId: entityId }
				});

				await imageKit.deleteFile(foundPicture.pictureId);
			}
		}

		const response = await imageKit.upload({
			file: base64String,
			fileName,
			folder
		});

		await prisma.profilePicture.create({
			data: {
				userId: userSession.id,
				pictureId: response.fileId,
				url: response.url
			}
		});

		return NextResponse.json(
			{
				message: 'Picture uploaded!',
				data: response,
				ok: true
			},
			{
				status: 200
			}
		);
	} catch (error) {
		console.error('Upload profile picture error:', error);
		return NextResponse.json(
			{
				message: 'Something wrong with server!',
				ok: false
			},
			{
				status: 500
			}
		);
	}
};
