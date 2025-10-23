import { getFetch } from '@/utils/api';
import type { TApiResults } from '@/utils/api/types';
import { API_ORDERS_PATH, getApiUrl } from '@/utils/routing';

export async function getOrders<T>(
	pathname: 'orders'
): Promise<TApiResults<T>> {
	return await getFetch(pathname, {
		next: { tags: ['orders'] }
		// headers: {}
	});
}

export async function getOrderById<T>(
	pathname: 'orders',
	id: string
): Promise<TApiResults<T>> {
	return await getFetch(`${pathname}/${id}`, {
		next: { tags: ['orders'] }
		// headers: {}
	});
}
