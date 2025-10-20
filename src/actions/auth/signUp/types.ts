export type TSignUpInput = {
	name?: string;
	email: string;
	password: string;
	confirmPassword?: string;
};

export type TSignUpResult =
	| { ok: true; userId: string }
	| {
			ok: false;
			code:
				| 'USER_EXISTS'
				| 'INVALID_INPUT'
				| 'PASSWORD_MISMATCH'
				| 'WEAK_PASSWORD'
				| 'SERVER_ERROR'
				| 'WRONG_PASSWORD';
	  };

export type TSignUpSubmitState = { ok: boolean; message?: string };
