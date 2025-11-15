import type { FieldErrors } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TLocationFormValue } from '@/types/location';

export type TUpdateOrderFormData = {
	orderId: string;
	title: string;
	description?: string | null;
	productsSelected?: MultiValue<OptionType>;
	productOptions?: OptionType[];
	location?: TLocationFormValue;
};

export type TUpdateOrderHookReturn = {
	onSubmit: (data: TUpdateOrderFormData) => void;
	error?: string;
};
