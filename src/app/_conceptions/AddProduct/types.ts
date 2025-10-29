import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';
import type { SelectOption } from '@/components/SelectField/types';

export type TAddProductFormData = {
	title: string;
	serialNumber: string;
	type?: string;
	specification?: string;
	guaranteeStart?: string; // yyyy-mm-dd
	guaranteeEnd?: string; // yyyy-mm-dd
	orderId?: string;
	isNew?: boolean;
};

export type TAddProductProps = {
	typeOptions: SelectOption[];
	currencyOptions: OptionType[];
};

export type TPriceProps = {
	currencyOptions: OptionType[];
	onChange: (val: MultiValue<OptionType>) => void;
};
