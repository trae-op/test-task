import type { TDynamicPageProps } from '@/types/dynamicPage';

import { getPictureByEntityId } from '@/actions/pictures/products';
import { getProducts } from '@/conceptions/Products/actions';
import { Container } from '@/conceptions/UpdateProduct';
import { prisma } from '@/prisma/prisma-client';

export default async function UpdateProductPage({ params }: TDynamicPageProps) {
	const { id } = await params;

	const { items, ok } = await getProducts({
		selectFields: {
			id: true,
			title: true,
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
	const [productType, currency] = await Promise.all([
		prisma.productType.findMany({ orderBy: { title: 'asc' } }),
		prisma.currency.findMany({ orderBy: { title: 'asc' } })
	]);
	const pictureData = await getPictureByEntityId(
		product !== undefined ? product?.id : ''
	);

	return (
		<Container
			values={
				product !== undefined
					? {
							...product,
							photo: pictureData.ok ? (pictureData.item?.url ?? null) : null
						}
					: undefined
			}
			productType={productType}
			currency={currency}
		/>
	);
}
