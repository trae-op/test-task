import { Container } from '@/conceptions/AddProduct';
import { prisma } from '@/prisma/prisma-client';

export default async function AppProductPage() {
	const [productType, currency] = await Promise.all([
		prisma.productType.findMany({ orderBy: { title: 'asc' } }),
		prisma.currency.findMany({ orderBy: { title: 'asc' } })
	]);

	return <Container productType={productType} currency={currency} />;
}
