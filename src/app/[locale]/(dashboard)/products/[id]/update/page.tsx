import type { TDynamicPageProps } from '@/types/dynamicPage';

import { getPictureByEntityId } from '@/actions/pictures/product';
import { getProducts } from '@/actions/products/action';
import { Container } from '@/conceptions/UpdateProduct/Container';

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
		/>
	);
}
