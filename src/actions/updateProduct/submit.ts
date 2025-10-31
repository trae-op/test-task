'use server';

import { revalidateTag } from 'next/cache';

import { convertToISOStringUTC } from '@/utils/dateTime';

import { updateProduct } from './action';
import type { TUpdateInput, TUpdateSubmitState } from './types';

export const updateProductSubmit = async (
	_prevState: TUpdateSubmitState,
	formData: FormData
): Promise<TUpdateSubmitState> => {
	const title = String(formData.get('title') || '');
	const type = (formData.get('type') as string) || undefined;
	const specification = (formData.get('specification') as string) || undefined;
	const guaranteeStart =
		(formData.get('guaranteeStart') as string) || undefined;
	const guaranteeEnd = (formData.get('guaranteeEnd') as string) || undefined;
	const pricesJson = String(formData.get('prices') || '[]');
	const isNew = String(formData.get('isNew') || 'false');
	const id = String(formData.get('id') || '');

	let prices: TUpdateInput['prices'] = [];
	try {
		prices = JSON.parse(pricesJson) ?? [];
	} catch {}

	const serialNumber = String(formData.get('serialNumber') || '');
	const orderId = String(formData.get('orderId') || '');

	const res = await updateProduct(id, {
		title,
		type: type ?? '',
		specification: specification ?? '',
		guaranteeStart: guaranteeStart ? convertToISOStringUTC(guaranteeStart) : '',
		guaranteeEnd: guaranteeEnd ? convertToISOStringUTC(guaranteeEnd) : '',
		serialNumber,
		orderId,
		isNew: isNew === 'true',
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
