import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { EmptyData } from '@/components/EmptyData';

import { getAddProductHref } from '@/utils/routing';

import { getProducts } from '@/actions/products';
import { AddEntity, Title as AddEntityTitle } from '@/conceptions/AddEntity';
import { ProductsTable } from '@/conceptions/Products';

async function Container() {
	const products = await getProducts();
	const isProductsArray = Array.isArray(products);

	return (
		<>
			<AddEntity
				addEntityHref={getAddProductHref}
				titleComponent={<AddEntityTitle title='Products' />}
				total={isProductsArray ? products.length : 0}
			/>
			{isProductsArray && !products.length ? (
				<EmptyData text='Could not find any products' />
			) : (
				<div className='mt-4'>
					<ProductsTable items={isProductsArray ? products : []} />
				</div>
			)}
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
