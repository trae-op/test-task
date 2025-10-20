'use client';

import { useMemo, useState } from 'react';
import type { MultiValue } from 'react-select';

import type { TAddProductState, TPriceOption, TSelectOption } from './types';

const PRICE_OPTIONS: TPriceOption[] = [
	{ value: 100, label: 'USD', isDefault: 0 },
	{ value: 2600, label: 'UAH', isDefault: 1 }
];

const ORDER_OPTIONS: TSelectOption[] = [
	{ value: '1', label: 'Product 1' },
	{ value: '2', label: 'Product 2' }
];

export const useAddProductState = (): TAddProductState & {
	setSelectedOrders: (opts: MultiValue<TSelectOption>) => void;
	setSelectedPrice: (opt?: TPriceOption) => void;
} => {
	const [selectedOrders, setSelectedOrders] = useState<
		MultiValue<TSelectOption>
	>([]);
	const [selectedPrice, setSelectedPrice] = useState<TPriceOption | undefined>(
		PRICE_OPTIONS.find(p => p.isDefault === 1)
	);

	const state = useMemo<TAddProductState>(() => {
		return {
			priceOptions: PRICE_OPTIONS,
			typeOptions: [
				{ value: 'laptop', label: 'Laptop' },
				{ value: 'phone', label: 'Phone' },
				{ value: 'accessory', label: 'Accessory' }
			],
			orderOptions: ORDER_OPTIONS,
			selectedOrders,
			selectedPrice
		};
	}, [selectedOrders, selectedPrice]);

	return {
		...state,
		setSelectedOrders,
		setSelectedPrice
	};
};
