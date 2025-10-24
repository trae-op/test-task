import { getFetch } from '@/utils/api';
import type { TApiResults } from '@/utils/api/types';

export async function getEntityById<T>(
	pathname: string,
	entityId: string
): Promise<TApiResults<T>> {
	return await getFetch(`${pathname}/${entityId}`, {
		method: 'GET',
		next: { revalidate: 60 }
	});
}
