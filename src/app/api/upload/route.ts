import ImageKit from 'imagekit';
import { NextRequest, NextResponse } from 'next/server';

import { TImageOptions } from '@/types/imageUpload';

import { getUserSession } from '@/utils/session';

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
		const file = formData.get('file') as Blob;
		const imageOptions = formData.get('imageOptions') as string;

		if (!file && !imageOptions.length) {
			return NextResponse.json(
				{ message: 'No file uploaded', ok: false },
				{ status: 400 }
			);
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64String = buffer.toString('base64');

		const { fileName, folder } = JSON.parse(imageOptions) as TImageOptions;

		// const deleteId = (deleteFileIdField || deleteFileId || '').toString();
		// if (deleteId && deleteId.length > 0) {
		// 	await imageKit.deleteFile(deleteId);
		// }

		console.log('fileName, folder', fileName, folder);

		const response = await imageKit.upload({
			file: base64String,
			fileName,
			folder
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
