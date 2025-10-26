import { TProduct } from '@/types/products';

import type { TApiResults } from '@/utils/api/types';

export type TRestResults = {
	items: TProduct[];
};

export type TGetEntitiesParams = {
	params: string;
	onSuccess?: (response: TApiResults<TRestResults>) => void;
};

export type TActionsHook = {
	getAllEntities: (params: TGetEntitiesParams) => Promise<void>;
	pending: boolean;
};
