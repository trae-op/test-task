import { Suspense } from 'react';

import type { TDynamicPageProps } from '@/types/dynamicPage';

import { DetailContainer } from '@/conceptions/Orders';
import { Provider as OrdersProvider } from '@/context/orders';
import { Provider as ProductsProvider } from '@/context/products';

async function Container({ params }: TDynamicPageProps) {
	const { id } = await params;

	return (
		<OrdersProvider entityId={id}>
			<ProductsProvider entityId={id}>
				<DetailContainer />
			</ProductsProvider>
		</OrdersProvider>
	);
}

export default function OrderPage(props: TDynamicPageProps) {
	return (
		<Suspense>
			<Container {...props} />
		</Suspense>
	);
}
