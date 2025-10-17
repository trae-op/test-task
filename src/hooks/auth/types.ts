import type { Session } from 'next-auth';

export type TAuthState = {
	status: 'loading' | 'authenticated' | 'unauthenticated';
	session: Session | null;
};

export type TAuthActions = {
	signIn: (
		email: string,
		password: string
	) => Promise<{ ok: boolean; error?: string }>;
	signOut: () => Promise<void>;
};

export type TUseAuthReturn = TAuthState & TAuthActions;
