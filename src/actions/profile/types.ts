export type TProfileInput = {
	name?: string | null;
	email: string;
};

export type TProfileResult =
	| { ok: true }
	| {
			ok: false;
			code: 'UNAUTHORIZED' | 'INVALID_INPUT' | 'EMAIL_TAKEN' | 'SERVER_ERROR';
	  };

export type TProfileSubmitState = { ok: boolean; message?: string };

export type TPasswordInput = {
	oldPassword: string;
	newPassword: string;
};

export type TPasswordResult =
	| { ok: true }
	| {
			ok: false;
			code:
				| 'UNAUTHORIZED'
				| 'INVALID_INPUT'
				| 'WRONG_PASSWORD'
				| 'SERVER_ERROR';
	  };

export type TPasswordSubmitState = { ok: boolean; message?: string };
