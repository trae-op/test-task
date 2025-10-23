import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { NotFound } from '@/components/NotFound';

import type { TProductData } from '@/types/product';

import { fetchProducts } from '@/utils/products';
import { getAddProductHref } from '@/utils/routing';

import { AddEntity } from '@/app/_conceptions/AddEntity/AddEntity';
import { ProductsTable } from '@/conceptions/Products';

async function Container() {
	const items: TProductData[] = await fetchProducts();
	if (!items?.length) {
		return <NotFound />;
	}
	return (
		<>
			<AddEntity
				addEntityHref={getAddProductHref}
				title='Products'
				total={items.length}
			/>
			<div className='mt-4'>
				<ProductsTable items={items} />
			</div>
		</>
	);
}

export default function ProductsPage() {
	return (
		<Suspense fallback={<DetailEntityLoading />}>
			<Container />
		</Suspense>
	);
}
