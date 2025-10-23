import { getFetch } from '@/utils/api';
import type { TApiResults } from '@/utils/api/types';

export async function deleteOrderById<T>(
	pathname: 'orders',
	id: string
): Promise<TApiResults<T>> {
	return await getFetch(`${pathname}?id=${id}`, {
		method: 'DELETE'
	});
}
