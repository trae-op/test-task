import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { NotFound } from '@/components/NotFound';

import type { TProductData } from '@/types/product';

import { fetchProducts } from '@/utils/products';

import { ProductsTable } from '@/conceptions/Products';

async function Container() {
	const items: TProductData[] = await fetchProducts();
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
