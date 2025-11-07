import { Dispatch, SetStateAction } from 'react';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import { TUpdateData } from '@/types/products';

export type TUpdateFormData = TUpdateData;

export type TPriceOption = OptionType & {
	isDefault?: boolean;
	valueAmount?: number;
	userId?: string;
	label?: string;
	value?: string;
	id?: string;
};

export type TOnUpdateSubmit = (data: TUpdateFormData) => void;

export type TUpdateActionsHook = {
	onUpdateSubmit: TOnUpdateSubmit;
	error?: string;
};

export type TPriceActionsParams = {
	onChange?: (val: MultiValue<TPriceOption>) => void;
	setPrices?: Dispatch<SetStateAction<MultiValue<TPriceOption>>>;
};
