import type { OptionType } from '@/components/ui/MultiSelectField/types';

export type TAddOrderFormData = {
	title: string;
	description?: string;
	products: string[]; // product ids
};

export type TAddOrderProps = {
	productOptions: OptionType[];
};
