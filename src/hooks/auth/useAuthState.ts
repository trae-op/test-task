import { useSession } from 'next-auth/react';

import type { TAuthState } from './types';

export const useAuthState = (): TAuthState => {
	const { data, status } = useSession();
	return { session: data ?? null, status };
};
