'use server';

import { redirect } from 'next/navigation';

import { addOrder } from './action';
import type { TAddOrderSubmitState } from './types';

export const addOrderSubmit = async (
	_prevState: TAddOrderSubmitState,
	formData: FormData
): Promise<TAddOrderSubmitState> => {
	const title = String(formData.get('title') || '');
	const description = (formData.get('description') as string) || undefined;
	const productsJson = String(formData.get('products') || '[]');

	let products: string[] = [];
	try {
		const parsed = JSON.parse(productsJson);
		if (Array.isArray(parsed)) products = parsed.map(v => String(v));
	} catch {}

	const res = await addOrder({
		title,
		description: description ?? null,
		products
	});

	if (res.ok) {
		const locale = String(formData.get('locale') || '');
		redirect(`/${locale}/orders`);
	}

	const codeToKey: Record<string, string> = {
		UNAUTHORIZED: 'default',
		INVALID_INPUT: 'invalidInput',
		PRODUCT_NOT_FOUND: 'default',
		SERVER_ERROR: 'default'
	};
	return { ok: false, message: codeToKey[res.code] ?? 'default' };
};
