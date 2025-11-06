export type TAddProductTypeInput = {
	title: string;
	value: string;
};

export type TAddProductTypeResult = {
	ok: boolean;
	code?: 'UNAUTHORIZED' | 'INVALID_INPUT' | 'SERVER_ERROR';
	item?: { id: string; title: string; value: string };
};

export type TAddProductTypeSubmitState = {
	ok: boolean;
	message?: string;
	item?: { id: string; title: string; value: string };
};
