import { getFetch } from '@/utils/api';
import type { TApiResults } from '@/utils/api/types';

const PATHNAME = 'productType';

export async function deleteEntityById<T>(id: string): Promise<TApiResults<T>> {
	return await getFetch(`${PATHNAME}?id=${id}`, { method: 'DELETE' });
}
