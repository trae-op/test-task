import type { TOrderData } from '@/types/order';
import type { TPrice } from '@/types/product';

export type TOrderProps = TOrderData;

export type TOrdersProps = {
	items: TOrderData[];
	isDetail?: boolean;
};

export type TOrderPriceProps = {
	price: TPrice[];
};