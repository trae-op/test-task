'use server';

import { redirect } from 'next/navigation';

import { addProduct } from './action';
import type { TAddProductSubmitState } from './types';

export const addProductSubmit = async (
	_prevState: TAddProductSubmitState,
	formData: FormData
): Promise<TAddProductSubmitState> => {
	const title = String(formData.get('title') || '');
	const type = (formData.get('type') as string) || undefined;
	const specification = (formData.get('specification') as string) || undefined;
	const guaranteeStart =
		(formData.get('guaranteeStart') as string) || undefined;
	const guaranteeEnd = (formData.get('guaranteeEnd') as string) || undefined;
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
		type: type ?? null,
		specification: specification ?? null,
		guaranteeStart: guaranteeStart ?? null,
		guaranteeEnd: guaranteeEnd ?? null,
		isNew: isNewRaw === 'true',
		prices
	});

	if (res.ok) {
		redirect(`/${locale}/products`);
	}

	const codeToKey: Record<string, string> = {
		UNAUTHORIZED: 'default',
		INVALID_INPUT: 'invalidInput',
		ORDER_NOT_FOUND: 'default',
		SERVER_ERROR: 'default',
		INT4_OVERFLOW: 'INT4_OVERFLOW'
	};

	return { ok: false, message: codeToKey[res.code] ?? 'default' };
};
