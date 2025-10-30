import { Dispatch, SetStateAction } from 'react';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

export type TUpdateProductFormData = {
	title: string;
	serialNumber: string;
	type?: string;
	specification?: string;
	guaranteeStart?: string;
	guaranteeEnd?: string;
	orderId?: string;
	isNew?: boolean;
};

export type TOnUpdateProductSubmit = (
	data: TUpdateProductFormData,
	prices: MultiValue<OptionType>,
	locale: string
) => void;

export type TUpdateProductActions = {
	onUpdateProductSubmit: TOnUpdateProductSubmit;
	state: { ok: boolean; message?: string };
	isPending: boolean;
};

export type TUsePriceActionsArgs = {
	onChange?: (val: MultiValue<OptionType>) => void;
	setPrices?: Dispatch<SetStateAction<MultiValue<OptionType>>>;
};
