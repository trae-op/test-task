import { TOrder } from '@/types/orders';

import type { TApiResults } from '@/utils/api/types';

export type TRestResults = {
	items: TOrder[];
};

export type TGetEntitiesParams = {
	params: string;
	onSuccess?: (response: TApiResults<TRestResults>) => void;
};

export type TActionsHook = {
	getAllEntities: (params: TGetEntitiesParams) => Promise<void>;
};
