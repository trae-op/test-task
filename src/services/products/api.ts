import { getFetch } from '@/utils/api';
import type { TApiResults } from '@/utils/api/types';

export async function deleteProductById<T>(
	pathname: 'products',
	id: string
): Promise<TApiResults<T>> {
	return await getFetch(`${pathname}?id=${id}`, {
		method: 'DELETE'
	});
}
