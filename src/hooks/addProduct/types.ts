import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

export type TPriceOption = OptionType & {
	isDefault?: boolean;
	valueAmount?: number;
	userId?: string;
	label?: string;
	value?: string;
	id?: string;
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
	actionsCallback: (data: FormData) => void
) => void;

export type TAddProductActions = {
	onAddProductSubmit: TOnAddProductSubmit;
};

export type TUsePriceActionsArgs = {
	onChange?: (val: MultiValue<TPriceOption>) => void;
};
