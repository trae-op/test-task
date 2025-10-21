'use server';

import { redirect } from 'next/navigation';

import { addProduct } from './action';
import type { TAddProductSubmitState } from './types';

export const addProductSubmit = async (
	_prevState: TAddProductSubmitState,
	formData: FormData
): Promise<TAddProductSubmitState> => {
	const title = String(formData.get('title') || '');
	const serialNumber = String(formData.get('serialNumber') || '');
	const type = (formData.get('type') as string) || undefined;
	const specification = (formData.get('specification') as string) || undefined;
	const guaranteeStart =
		(formData.get('guaranteeStart') as string) || undefined;
	const guaranteeEnd = (formData.get('guaranteeEnd') as string) || undefined;
	const orderId = (formData.get('orderId') as string) || undefined;
	const isNewRaw = (formData.get('isNew') as string) || undefined;
	const pricesJson = String(formData.get('prices') || '[]');
	const locale = String(formData.get('locale') || '');

	let prices: Array<{
		symbol: 'USD' | 'UAH';
		value: number;
		isDefault?: boolean;
	}> = [];
	try {
		prices = JSON.parse(pricesJson) ?? [];
	} catch {}

	const res = await addProduct({
		title,
		serialNumber,
		type: type ?? null,
		specification: specification ?? null,
		guaranteeStart: guaranteeStart ?? null,
		guaranteeEnd: guaranteeEnd ?? null,
		orderId: orderId ?? null,
		isNew: isNewRaw === '1' || isNewRaw === 'true' ? '1' : '0',
		prices
	});

	if (res.ok) {
		redirect(`/${locale}/products`);
	}

	const codeToKey: Record<string, string> = {
		UNAUTHORIZED: 'default',
		INVALID_INPUT: 'invalidInput',
		ORDER_NOT_FOUND: 'default',
		SERVER_ERROR: 'default'
	};
	return { ok: false, message: codeToKey[res.code] ?? 'default' };
};
