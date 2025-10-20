'use server';

import { addProduct } from '@/actions/addProduct/action';
import type { TAddProductSubmitState } from '@/actions/addProduct/types';

export const addProductSubmit = async (
	_prevState: TAddProductSubmitState,
	formData: FormData
): Promise<TAddProductSubmitState> => {
	const title = String(formData.get('title') || '').trim();
	const type = String(formData.get('type') || '').trim();
	const specification = String(formData.get('specification') || '').trim();
	const guaranteeStart = String(formData.get('guaranteeStart') || '');
	const guaranteeEnd = String(formData.get('guaranteeEnd') || '');

	// price: expects "value" and "symbol" from select
	const priceValueRaw = formData.get('price.value');
	const priceSymbolRaw = formData.get('price.symbol');
	const priceValue = priceValueRaw !== null ? Number(priceValueRaw) : undefined;
	const priceSymbol = priceSymbolRaw ? String(priceSymbolRaw) : undefined;

	// orders: expects multiple ids as orders[] entries
	const orders: string[] = [];
	formData.forEach((v, k) => {
		if (k === 'orders[]') {
			orders.push(String(v));
		}
	});

	const res = await addProduct({
		title,
		type: type || undefined,
		specification: specification || undefined,
		guaranteeStart: guaranteeStart || undefined,
		guaranteeEnd: guaranteeEnd || undefined,
		price:
			priceValue !== undefined && priceSymbol
				? { value: priceValue, symbol: priceSymbol as 'USD' | 'UAH' }
				: undefined,
		orders
	});

	if (res.ok) return { ok: true };

	const codeToKey: Record<string, string> = {
		INVALID_INPUT: 'invalidInput',
		SERVER_ERROR: 'default'
	};
	return { ok: false, message: codeToKey[res.code ?? 'default'] ?? 'default' };
};
