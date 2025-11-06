export type TAddCurrencyInput = {
	title: string;
	value: string;
};

export type TAddCurrencyResult = {
	ok: boolean;
	code?: 'UNAUTHORIZED' | 'INVALID_INPUT' | 'SERVER_ERROR';
	item?: { id: string; title: string; value: string };
};

export type TAddCurrencySubmitState = {
	ok: boolean;
	message?: string;
	item?: { id: string; title: string; value: string };
};
