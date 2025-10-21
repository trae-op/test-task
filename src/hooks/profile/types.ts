export type TProfileFormData = {
	name?: string;
	email: string;
};

export type TPasswordFormData = {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export type TProfileActions = {
	onProfileSubmit: (data: TProfileFormData, locale: string) => void;
	state: { ok: boolean; message?: string };
	isPending: boolean;
};

export type TPasswordActions = {
	onPasswordSubmit: (data: TPasswordFormData, locale: string) => void;
	state: { ok: boolean; message?: string };
	isPending: boolean;
};
