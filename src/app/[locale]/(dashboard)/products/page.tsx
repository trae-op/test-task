import { filterProductsByType, getProducts } from '@/actions/products';
import { Container } from '@/conceptions/Products';
import { Provider } from '@/context/products';

export default async function ProductsPage({
	searchParams
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const sp = await searchParams;
	const typeParamRaw = sp?.type;
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

	const { items, ok } = typeParam
		? await filterProductsByType(typeParam, { selectFields })
		: await getProducts({ selectFields });

	return (
		<Provider items={ok ? items : []}>
			<Container />
		</Provider>
	);
}
