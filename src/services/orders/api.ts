import { getFetch } from '@/utils/api';
import type { TApiResults } from '@/utils/api/types';

const PATHNAME = 'orders';

export async function getEntities<T>(
	params: string = ''
): Promise<TApiResults<T>> {
	return await getFetch(`${PATHNAME}/${params}`, {
		method: 'GET',
		next: { tags: [PATHNAME] }
	});
}

export async function deleteEntityById<T>(id: string): Promise<TApiResults<T>> {
	return await getFetch(`${PATHNAME}?id=${id}`, {
		method: 'DELETE'
	});
}
