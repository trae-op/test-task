import type { ReactNode } from 'react';

export type TAuthProviderProps = { children: ReactNode };

export type TSignUpFormData = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export type TSignInFormData = {
	email: string;
	password: string;
};
