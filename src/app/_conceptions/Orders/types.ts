import type { TOrderData } from '@/types/order';
import type { TPrice } from '@/types/product';

export type TOrderProps = TOrderData & {
	isDeleteButton?: boolean;
	isActive?: boolean;
};

export type TOrdersProps = {
	items: TOrderData[];
	isDetail?: boolean;
};

export type TOrderPriceProps = {
	price: TPrice[];
};
