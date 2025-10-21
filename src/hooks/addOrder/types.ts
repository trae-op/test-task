import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/ui/MultiSelectField/types';

export type TAddOrderFormData = {
	title: string;
	description?: string;
};

export type TOnAddOrderSubmit = (
	data: TAddOrderFormData,
	products: MultiValue<OptionType>,
	locale: string
) => void;

export type TAddOrderActions = {
	onAddOrderSubmit: TOnAddOrderSubmit;
	state: { ok: boolean; message?: string };
	isPending: boolean;
};
