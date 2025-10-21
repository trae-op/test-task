import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/ui/MultiSelectField/types';

export type TPriceInput = {
	symbol: 'USD' | 'UAH';
	value: number;
	isDefault: boolean;
};

export type TAddProductFormData = {
	title: string;
	serialNumber: string;
	type?: string;
	specification?: string;
	guaranteeStart?: string;
	guaranteeEnd?: string;
	orderId?: string;
	isNew?: boolean;
};

export type TOnAddProductSubmit = (
	data: TAddProductFormData,
	prices: MultiValue<OptionType>,
	locale: string
) => void;

export type TAddProductActions = {
	onAddProductSubmit: TOnAddProductSubmit;
	state: { ok: boolean; message?: string };
	isPending: boolean;
};
