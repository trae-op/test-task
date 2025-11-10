import { getPicturesByProducts } from '@/utils/products';

import { getPicturesByEntities } from '@/actions/pictures/products';
import { getProducts } from '@/actions/products';
import { Container } from '@/conceptions/Products';
import { Provider } from '@/context/products';

export default async function ProductsPage({
	searchParams
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const params = await searchParams;
	const typeParamRaw = params?.type;
	const typeParam = Array.isArray(typeParamRaw)
		? typeParamRaw[0]
		: typeof typeParamRaw === 'string'
			? typeParamRaw
			: undefined;

	const selectFields = {
		id: true,
		title: true,
		photo: true,
		serialNumber: true,
		guaranteeStart: true,
		guaranteeEnd: true,
		prices: true,
		order: true,
		isNew: true,
		type: true
	} as const;

	const { items, ok } = await getProducts({
		selectFields,
		...(typeParam ? { whereFilters: { type: typeParam } } : {})
	});
	const products = ok && items !== undefined ? items : [];
	const picturesByProducts = await getPicturesByEntities(
		products.length ? products.map(product => product.id) : []
	);
	const picturesByProductId = getPicturesByProducts(picturesByProducts);

	return (
		<Provider
			items={products.map(product => ({
				...product,
				photo: picturesByProductId(product.id)
			}))}
		>
			<Container />
		</Provider>
	);
}
