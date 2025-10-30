import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';
import type { SelectOption } from '@/components/SelectField/types';

import { TProduct } from '@/types/products';

export type TPriceOption = OptionType & {
	isDefault?: boolean;
};

export type TUpdateProductFormData = {
	title?: string | undefined;
	serialNumber?: string | undefined;
	type?: string | undefined;
	specification?: string | undefined;
	guaranteeStart?: string | undefined;
	guaranteeEnd?: string | undefined;
	orderId?: string | undefined;
	isNew?: boolean | undefined;
	prices?: MultiValue<TPriceOption>;
};

export type TUpdateProductProps = {
	typeOptions: SelectOption[];
	currencyOptions: TPriceOption[];
	defaultValues?: TUpdateProductFormData;
};

export type TPriceProps = {
	currencyOptions: TPriceOption[];
	onChange: (val: MultiValue<TPriceOption>) => void;
	prices?: MultiValue<TPriceOption>;
};
