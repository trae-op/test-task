import type { TSignUpSubmitState } from '@/app/_conceptions/Auth/actions/types';

export type TAuthActions = {
	signOut: () => Promise<void>;
	onSignInSubmit: (data: { email: string; password: string }) => Promise<void>;
	onSignUpSubmit: (data: {
		name: string;
		email: string;
		password: string;
		confirmPassword: string;
	}) => void;
	signUpState: TSignUpSubmitState;
	signUpIsPending: boolean;
	signInError?: string | null;
};
