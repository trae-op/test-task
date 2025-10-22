import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

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

export type TUsePriceActionsArgs = {
	onChange?: (val: MultiValue<OptionType>) => void;
};
