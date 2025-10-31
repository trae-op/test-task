import type { TDynamicPageProps } from '@/types/dynamicPage';

import { getProducts } from '@/actions/products/action';
import { Container } from '@/conceptions/UpdateProduct/Container';

export default async function UpdateProductPage({ params }: TDynamicPageProps) {
	const { id } = await params;

	const { items, ok } = await getProducts({
		selectFields: {
			id: true,
			title: true,
			photo: true,
			serialNumber: true,
			guaranteeStart: true,
			guaranteeEnd: true,
			specification: true,
			prices: true,
			order: true,
			isNew: true,
			type: true
		},
		whereFilters: { id }
	});
	const product = ok && items?.length ? items[0] : undefined;

	return <Container values={product} />;
}
