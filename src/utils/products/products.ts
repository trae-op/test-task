import type { TGuarantee, TPrice, TProductData } from '@/types/product';

import { API_PRODUCTS_PATH, getApiUrl } from '@/utils/routing';

type RawProduct = {
	id: string;
	title: string | null;
	serialNumber: string | null;
	type: string | null;
	date: string | null;
	price: TPrice[] | null;
	isNew: number | null;
	photo: string | null;
	specification: string | null;
	guaranteeStart: string | null;
	guaranteeEnd: string | null;
	order: number | null;
};

function mapProduct(raw: RawProduct): TProductData {
	return {
		id: raw.id,
		title: raw.title ?? undefined,
		serialNumber: raw.serialNumber ?? undefined,
		type: raw.type ?? undefined,
		date: raw.date ? new Date(raw.date) : undefined,
		price: raw.price ?? undefined,
		isNew: raw.isNew === 0 || raw.isNew === 1 ? raw.isNew : undefined,
		photo: raw.photo ?? undefined,
		specification: raw.specification ?? undefined,
		guarantee:
			raw.guaranteeStart && raw.guaranteeEnd
				? {
						start: new Date(raw.guaranteeStart),
						end: new Date(raw.guaranteeEnd)
					}
				: undefined,
		order: raw.order ?? undefined
	};
}

export const fetchProducts = async (): Promise<TProductData[]> => {
	const res = await fetch(getApiUrl(API_PRODUCTS_PATH), {
		next: { tags: ['products'] }
	});
	if (!res.ok) {
		throw new Error('Failed to load products');
	}
	const data: RawProduct[] = await res.json();
	return Array.isArray(data) ? data.map(mapProduct) : [];
};
