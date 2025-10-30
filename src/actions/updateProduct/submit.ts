'use server';

import { revalidateTag } from 'next/cache';

import { TPrice } from '@/types/price';

import { updateProduct } from './action';
import type {
	TUpdateProductInput,
	TUpdateProductResult,
	TUpdateProductSubmitState
} from './types';

const convertToISOStringUTC = (dateString: string): string => {
	// 1. Додаємо 'T00:00:00.000Z' до рядка дати.
	// Це створює рядок, який точно вказує на час у UTC (незалежно від локального часового поясу).
	const utcString = `${dateString}T00:00:00.000Z`;

	// 2. Створюємо об'єкт Date, щоб переконатися, що формат коректний (необов'язково).
	// Потім повертаємо його у форматі ISO.
	return new Date(utcString).toISOString();
};

export const updateProductSubmit = async (
	_prevState: TUpdateProductSubmitState,
	formData: FormData
): Promise<TUpdateProductSubmitState> => {
	const title = String(formData.get('title') || '');
	const type = (formData.get('type') as string) || undefined;
	const specification = (formData.get('specification') as string) || undefined;
	const guaranteeStart =
		(formData.get('guaranteeStart') as string) || undefined;
	const guaranteeEnd = (formData.get('guaranteeEnd') as string) || undefined;
	const orderId = (formData.get('orderId') as string) || undefined;
	const isNewRaw = (formData.get('isNew') as string) || undefined;
	const pricesJson = String(formData.get('prices') || '[]');
	const locale = String(formData.get('locale') || '');
	const id = String(formData.get('id') || '');

	let prices: TUpdateProductInput['prices'] = [];
	try {
		prices = JSON.parse(pricesJson) ?? [];
	} catch {}

	const res = await updateProduct(id, {
		title,
		type: type ?? null,
		specification: specification ?? null,
		guaranteeStart: guaranteeStart
			? convertToISOStringUTC(guaranteeStart)
			: null,
		guaranteeEnd: guaranteeEnd ? convertToISOStringUTC(guaranteeEnd) : null,
		//orderId: orderId ?? null,
		isNew: isNewRaw === 'true',
		prices
	});

	if (res.ok) {
		revalidateTag('products');
	}

	const codeToKey: Record<string, string> = {
		UNAUTHORIZED: 'default',
		INVALID_INPUT: 'invalidInput',
		ORDER_NOT_FOUND: 'default',
		SERVER_ERROR: 'default'
	};

	return {
		ok: false,
		message: res.code ? (codeToKey[res.code] ?? 'default') : undefined
	};
};
