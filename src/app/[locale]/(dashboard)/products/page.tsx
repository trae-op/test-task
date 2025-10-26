import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { EmptyData } from '@/components/EmptyData';

import { getAddProductHref } from '@/utils/routing';

import { getProducts } from '@/actions/products';
import { AddEntity, Title as AddEntityTitle } from '@/conceptions/AddEntity';
import { ProductsTable } from '@/conceptions/Products';
import { Provider as ProductsProvider } from '@/context/products';

async function Container() {
	const products = await getProducts();
	const isProductsArray = Array.isArray(products);
	const items = isProductsArray ? products : [];

	return (
		<ProductsProvider items={items}>
			<AddEntity
				addEntityHref={getAddProductHref}
				titleComponent={<AddEntityTitle title='Products' />}
				total={items.length}
			/>
			{isProductsArray && !products.length ? (
				<EmptyData text='Could not find any products' />
			) : (
				<div className='mt-4'>
					<ProductsTable />
				</div>
			)}
		</ProductsProvider>
	);
}

export default function ProductsPage() {
	return (
		<Suspense fallback={<DetailEntityLoading />}>
			<Container />
		</Suspense>
	);
}
