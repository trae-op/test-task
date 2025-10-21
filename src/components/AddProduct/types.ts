import type { OptionType } from '@/components/ui/MultiSelectField/types';
import type { SelectOption } from '@/components/ui/SelectField/types';

export type TPriceInput = {
	symbol: 'USD' | 'UAH';
	value: number;
	isDefault: boolean;
};

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
	orderOptions: SelectOption[];
	currencyOptions: OptionType[];
};
