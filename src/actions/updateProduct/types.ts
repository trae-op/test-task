import type { TPrice } from '@/types/price';

export type TUpdateProductInput = {
	title: string;
	type?: string | null;
	specification?: string | null;
	guaranteeStart?: string | null; // ISO date string yyyy-mm-dd
	guaranteeEnd?: string | null;
	orderId?: string | null;
	isNew?: boolean;
	prices: Array<{ symbol: 'USD' | 'UAH'; value: number; isDefault?: boolean }>;
};

export type TUpdateProductResult = {
	ok: boolean;
	code?: 'INVALID_INPUT' | 'UNAUTHORIZED' | 'SERVER_ERROR' | 'ORDER_NOT_FOUND';
};

export type TUpdateProductSubmitState = { ok: boolean; message?: string };
