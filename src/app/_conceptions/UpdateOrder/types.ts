import type { OptionType } from '@/components/MultiSelectField/types';

import type { TOrder } from '@/types/orders';

export type TUpdateOrderFormProps = {
	productOptions: OptionType[];
};

export type TUpdateContainerProps = {
	values?: TOrder;
	products: { id: string; title: string | null }[];
};

export type TOrderLocationDetails = {
	latitude: number;
	longitude: number;
	country?: string | null;
	state?: string | null;
	city?: string | null;
	district?: string | null;
	street?: string | null;
	postcode?: string | null;
	displayName?: string | null;
};
