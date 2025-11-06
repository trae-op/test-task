export type TSettingsCurrencyFormData = {
	title: string;
	value: string;
};

export type TSubmitState = {
	ok: boolean;
	message?: string;
	item?: { id: string; title: string; value: string };
};

export type TDeleteEntityParams = { id: string; onSuccess?: () => void };

export type TActions = {
	onSubmit: (data: TSettingsCurrencyFormData) => void;
	state: TSubmitState;
	deleteEntity: (params: TDeleteEntityParams) => Promise<void>;
};
