import { useFormContext } from 'react-hook-form';

import { Price } from '../Price';
import { TPriceOption } from '../types';

const currencyOptions: TPriceOption[] = [
	{ value: 'USD', label: 'USD' },
	{ value: 'UAH', label: 'UAH' }
];

export const PriceField = () => {
	const { setValue, watch } = useFormContext();
	const prices = watch('prices') || [];

	return (
		<Price
			currencyOptions={currencyOptions}
			prices={prices}
			onChange={(val: any) => setValue('prices', val)}
		/>
	);
};
