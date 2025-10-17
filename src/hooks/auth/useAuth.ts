import { useMemo } from 'react';

import type { TUseAuthReturn } from './types';
import { useAuthActions } from './useAuthActions';
import { useAuthState } from './useAuthState';

export const useAuth = (): TUseAuthReturn => {
	const state = useAuthState();
	const actions = useAuthActions();
	return useMemo(() => ({ ...state, ...actions }), [state, actions]);
};
