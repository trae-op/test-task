'use server';

import { addCurrency } from './action';
import type { TAddCurrencySubmitState } from './types';

export const addCurrencySubmit = async (
	_prevState: TAddCurrencySubmitState,
	formData: FormData
): Promise<TAddCurrencySubmitState> => {
	const title = String(formData.get('title') || '');
	const value = String(formData.get('value') || '');

	const res = await addCurrency({ title, value });

	if (res.ok && res.item) {
		return { ok: true, item: res.item };
	}

	const codeToKey: Record<string, string> = {
		UNAUTHORIZED: 'default',
		INVALID_INPUT: 'invalidInput',
		SERVER_ERROR: 'default',
		ALREADY_EXISTS: 'ALREADY_EXISTS'
	};

	return { ok: false, message: codeToKey[res.code ?? 'DEFAULT'] ?? 'default' };
};
