import type { TOrder } from '@/types/orders';
import type { TPrice } from '@/types/price';

export type TOrderProps = TOrder & {
	isDeleteButton?: boolean;
	isActive?: boolean;
	prices?: TPrice[];
};

export type TOrdersProps = {
	items: TOrder[];
	isDetail?: boolean;
	activeId?: string;
};
