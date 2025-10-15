import { OrderTable } from '@/components/Orders';

import type { TOrderData } from '@/types/order';

const dummyData: TOrderData[] = [
	{
		id: '1',
		title: 'Длинное предлинное длиннющее название прихода',
		productCount: 23,
		date: new Date('2017-06-29 12:09:33'),
		description: 'description',
		price: [
			{ value: 100, symbol: 'USD', isDefault: 0 },
			{ value: 2600, symbol: 'UAH', isDefault: 1 }
		],
		products: [
			{
				id: '1',
				serialNumber: '1234',
				isNew: 1,
				photo: '',
				title: 'Product 1',
				type: 'Monitors',
				specification: 'Specification 1',
				guarantee: {
					start: new Date('2017-06-29 12:09:33'),
					end: new Date('2017-06-29 12:09:33')
				},
				price: [
					{ value: 100, symbol: 'USD', isDefault: 0 },
					{ value: 2600, symbol: 'UAH', isDefault: 1 }
				],
				order: 1,
				date: new Date('2017-06-29 12:09:33')
			},
			{
				id: '2',
				serialNumber: '1234455',
				isNew: 1,
				photo: '',
				title: 'Product 2',
				type: 'Monitors',
				specification: 'Specification 2',
				guarantee: {
					start: new Date('2017-06-29 12:09:33'),
					end: new Date('2017-06-29 12:09:33')
				},
				price: [
					{ value: 200, symbol: 'USD', isDefault: 0 },
					{ value: 3600, symbol: 'UAH', isDefault: 1 }
				],
				order: 1,
				date: new Date('2017-06-29 12:09:33')
			}
		]
	},
	{
		id: '2',
		title: 'Длинное предлинное длиннющее название прихода',
		productCount: 2,
		date: new Date('2017-06-29 12:09:33'),
		description: 'description',
		price: [
			{ value: 100, symbol: 'USD', isDefault: 0 },
			{ value: 2600, symbol: 'UAH', isDefault: 1 }
		],
		products: [
			{
				id: '3',
				serialNumber: '1234',
				isNew: 1,
				photo: '',
				title: 'Product 3',
				type: 'Monitors',
				specification: 'Specification 3',
				guarantee: {
					start: new Date('2017-06-29 12:09:33'),
					end: new Date('2017-06-29 12:09:33')
				},
				price: [
					{ value: 500, symbol: 'USD', isDefault: 0 },
					{ value: 6600, symbol: 'UAH', isDefault: 1 }
				],
				order: 1,
				date: new Date('2017-06-29 12:09:33')
			},
			{
				id: '4',
				serialNumber: '1234455',
				isNew: 1,
				photo: '',
				title: 'Product 4',
				type: 'Monitors',
				specification: 'Specification 4',
				guarantee: {
					start: new Date('2017-06-29 12:09:33'),
					end: new Date('2017-06-29 12:09:33')
				},
				price: [
					{ value: 400, symbol: 'USD', isDefault: 0 },
					{ value: 5600, symbol: 'UAH', isDefault: 1 }
				],
				order: 1,
				date: new Date('2017-06-29 12:09:33')
			}
		]
	}
];

export default function OrdersPage() {
	return (
		<>
			<OrderTable items={dummyData} />
		</>
	);
}
