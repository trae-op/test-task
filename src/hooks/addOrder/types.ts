import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

export type TAddOrderFormData = {
	title: string;
	description?: string;
};

export type TOnAddOrderSubmit = (
	data: TAddOrderFormData,
	products: MultiValue<OptionType>,
	locale: string,
	actionsCallback: (data: FormData) => void
) => void;

export type TAddOrderActions = {
	onAddOrderSubmit: TOnAddOrderSubmit;
};
