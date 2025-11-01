import type { FieldErrors } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

export type TUpdateOrderFormData = {
	orderId: string;
	title: string;
	description?: string | null;
	productsSelected?: MultiValue<OptionType>;
	productOptions?: OptionType[];
};

export type TUpdateOrderHookReturn = {
	onSubmit: (data: TUpdateOrderFormData) => void;
	isLoading: boolean;
	error?: string;
	errors: FieldErrors<TUpdateOrderFormData>;
};
