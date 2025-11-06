import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

export type TAddProductFormData = {
	title: string;
	serialNumber: string;
	type?: string;
	specification?: string;
	guaranteeStart?: string;
	guaranteeEnd?: string;
	orderId?: string;
	isNew?: boolean;
};

export type TPriceProps = {
	currencyOptions: OptionType[];
	onChange: (val: MultiValue<OptionType>) => void;
};

export type TOptionItem = { id: string; value: string; title: string };
export type TAddProductFormExtended = TAddProductFormData & {
	productType?: TOptionItem[];
	currency?: TOptionItem[];
};

export type TContainerProps = Pick<
	TAddProductFormExtended,
	'productType' | 'currency'
>;
