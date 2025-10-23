import { getFetch } from '@/utils/api';
import type { TApiResults } from '@/utils/api/types';

export async function getProducts<T>(
	pathname: 'products'
): Promise<TApiResults<T>> {
	return await getFetch(pathname, {
		method: 'GET',
		next: { tags: ['products'] }
	});
}
