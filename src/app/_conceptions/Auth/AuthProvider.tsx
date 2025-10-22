'use client';

import { SessionProvider } from 'next-auth/react';
import { memo } from 'react';

import type { TAuthProviderProps } from './types';

export const AuthProvider = memo(({ children }: TAuthProviderProps) => {
	return <SessionProvider>{children}</SessionProvider>;
});
