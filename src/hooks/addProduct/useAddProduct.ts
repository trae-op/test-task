'use client';

import { useMemo } from 'react';

import type { TUseAddProduct } from './types';
import { useAddProductActions } from './useAddProductActions';
import { useAddProductState } from './useAddProductState';

export const useAddProduct = (): TUseAddProduct => {
	const state = useAddProductState();
	const actions = useAddProductActions(state);
	return useMemo(() => ({ ...state, ...actions }), [state, actions]);
};
