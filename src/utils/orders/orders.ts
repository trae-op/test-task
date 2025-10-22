import { API_ORDERS_PATH, getApiUrl } from '@/utils/routing';

import type { TFetchOrdersResult } from './types';

export const fetchOrders = async (): Promise<TFetchOrdersResult> => {
	const res = await fetch(getApiUrl(API_ORDERS_PATH), {
		next: { tags: ['orders'] }
	});
	if (!res.ok) {
		throw new Error('Failed to load orders');
	}
	return res.json();
};
