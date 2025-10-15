import type { TOrderData } from '@/types/order';
import type { TPrice } from '@/types/product';

export type TOrderProps = TOrderData;

export type TOrdersProps = {
	items: TOrderData[];
};

export type TOrderPriceProps = {
	price: TPrice[];
};