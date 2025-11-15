export type TSettingsProductTypeFormData = {
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
	onSubmit: (data: TSettingsProductTypeFormData) => void;
	state: TSubmitState;
	deleteEntity: (id: string) => void;
};
