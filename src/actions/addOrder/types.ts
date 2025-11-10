type TProductIdList = string[] | null;

export type TAddOrderInput = {
	title: string;
	description?: string | null;
	products?: TProductIdList;
};

export type TAddOrderResult =
	| { ok: true; id: string }
	| {
			ok: false;
			code:
				| 'INVALID_INPUT'
				| 'UNAUTHORIZED'
				| 'SERVER_ERROR'
				| 'PRODUCT_NOT_FOUND';
	  };

export type TAddOrderSubmitState = { ok: boolean; message?: string };
