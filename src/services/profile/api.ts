import { TApiResults, getFetch } from '@/utils/api';

export async function profileAvatar<T>(
	pathname: 'profile-avatar',
	formData: FormData
): Promise<TApiResults<T>> {
	return await getFetch(pathname, {
		method: 'POST',
		body: formData,
		headers: {}
	});
}
