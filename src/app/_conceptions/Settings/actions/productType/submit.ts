'use server';

import { addProductType } from './action';
import type { TAddProductTypeSubmitState } from './types';

export const addProductTypeSubmit = async (
	_prevState: TAddProductTypeSubmitState,
	formData: FormData
): Promise<TAddProductTypeSubmitState> => {
	const title = String(formData.get('title') || '');
	const value = String(formData.get('value') || '');

	const res = await addProductType({ title, value });

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
