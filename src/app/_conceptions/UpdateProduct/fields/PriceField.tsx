import { useFormContext } from 'react-hook-form';

import { Price } from '../Price';
import type { TPriceOption } from '../types';

export const PriceField = ({
	currencyOptions
}: {
	currencyOptions: TPriceOption[];
}) => {
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
