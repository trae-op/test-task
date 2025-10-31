import { OptionType } from '@/components/MultiSelectField/types';

export type TPriceOption = OptionType & {
	valueAmount: number;
	isDefault: boolean;
};
