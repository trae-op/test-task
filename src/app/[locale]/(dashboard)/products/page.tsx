import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { NotFound } from '@/components/NotFound';

import type { TProductData } from '@/types/product';

import { API_PRODUCTS_PATH, getApiUrl } from '@/utils/routing';

import { ProductsTable } from '@/conceptions/Products';

async function Container() {
	const res = await fetch(getApiUrl(API_PRODUCTS_PATH), {
		next: { tags: ['products'] }
	});
	const items: TProductData[] = await res.json();
	if (!items?.length) {
		return <NotFound />;
	}
	return <ProductsTable items={items} />;
}

export default function ProductsPage() {
	return (
		<Suspense fallback={<DetailEntityLoading />}>
			<Container />
		</Suspense>
	);
}
