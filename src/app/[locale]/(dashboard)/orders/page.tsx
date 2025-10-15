import { OrderTable } from '@/components/Orders';

import type { TOrderData } from '@/types/order';

const dummyData: TOrderData[] = [
	{
		id: '1',
		title: 'Длинное предлинное длиннющее название прихода',
		date: new Date('2017-06-29 12:09:33'),
		description: 'description',
		price: [
			{ value: 100, symbol: 'USD', isDefault: 0 },
			{ value: 2600, symbol: 'UAH', isDefault: 1 }
		],
		products: ['1', '2', '3']
	},
	{
		id: '2',
		title: 'Длинное предлинное длиннющее название прихода',
		date: new Date('2017-06-29 12:09:33'),
		description: 'description',
		price: [
			{ value: 100, symbol: 'USD', isDefault: 0 },
			{ value: 2600, symbol: 'UAH', isDefault: 1 }
		],
		products: ['3', '4']
	}
];

export default function OrdersPage() {
	return <OrderTable items={dummyData} />;
}
