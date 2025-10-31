import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';
import type { SelectOption } from '@/components/SelectField/types';

import { TProduct, TUpdateData } from '@/types/products';

export type TEntity = TUpdateData;

export type TPriceOption = OptionType & {
	isDefault?: boolean;
	valueAmount?: number;
	userId?: string;
	id?: string;
};

export type TUpdateFormData = TEntity;

export type TUpdateFormProps = {
	typeOptions: SelectOption[];
	currencyOptions: TPriceOption[];
	defaultValues?: TEntity;
};

export type TUpdateContainerProps = {
	values?: TProduct;
};

export type TPriceProps = {
	currencyOptions: TPriceOption[];
	onChange: (val: MultiValue<TPriceOption>) => void;
	prices?: MultiValue<TPriceOption>;
};
