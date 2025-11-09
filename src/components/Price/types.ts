import { TOrderPriceSummary } from '@/types/orders';
import type { TPrice } from '@/types/price';

export type TPriceProps = {
	prices?: TOrderPriceSummary[];
	hasAdaptiveTable?: boolean;
};
