export type TAuthActions = {
	signIn: (
		email: string,
		password: string
	) => Promise<{ ok: boolean; error?: string }>;
	signOut: () => Promise<void>;
};
