import type { TPageProps } from './types';

export default async function OrderPage({ params }: TPageProps) {
	const { id } = await params;

	return <div>Order Page: {id}</div>;
}
