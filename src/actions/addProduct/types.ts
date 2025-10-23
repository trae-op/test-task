export type TAddProductInput = {
	title: string;
	type?: string | null;
	specification?: string | null;
	guaranteeStart?: string | null; // ISO date string yyyy-mm-dd
	guaranteeEnd?: string | null;
	orderId?: string | null;
	isNew?: boolean;
	prices: Array<{ symbol: 'USD' | 'UAH'; value: number; isDefault?: boolean }>;
};

export type TAddProductResult =
	| { ok: true; id: string }
	| {
			ok: false;
			code:
				| 'INVALID_INPUT'
				| 'UNAUTHORIZED'
				| 'SERVER_ERROR'
				| 'ORDER_NOT_FOUND';
	  };

export type TAddProductSubmitState = { ok: boolean; message?: string };
