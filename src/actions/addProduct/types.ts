export type TAddProductInput = {
	title: string;
	type?: string;
	specification?: string;
	guaranteeStart?: string; // ISO date string
	guaranteeEnd?: string; // ISO date string
	price?: { value: number; symbol: 'USD' | 'UAH' };
	orders?: string[]; // Order IDs to connect
};

export type TAddProductResult =
	| { ok: true; productId: string }
	| { ok: false; code?: 'INVALID_INPUT' | 'SERVER_ERROR' };

export type TAddProductSubmitState = { ok: boolean; message?: string };
