import { type TApiResults, getFetch } from '@/utils/api';

export async function uploadPicture<T>(
	pathname: string,
	formData: FormData
): Promise<TApiResults<T>> {
	return await getFetch(pathname, {
		method: 'POST',
		body: formData,
		headers: {}
	});
}
