import type { OptionType } from '@/components/MultiSelectField/types';

import type { TOrder } from '@/types/orders';

export type TUpdateOrderFormProps = {
	productOptions: OptionType[];
};

export type TUpdateContainerProps = {
	values?: TOrder;
	products: { id: string; title: string | null }[];
};
