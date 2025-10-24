import type { TApiResults } from '@/utils/api/types';

export type TRestResults = {
	items: [] | undefined;
};

export type TGetEntityParams = {
	entityId: string;
	entityName: string;
	onSuccess?: (response: TApiResults<TRestResults>) => void;
};

export type TActionsHook = {
	getEntity: (params: TGetEntityParams) => Promise<void>;
	pending: boolean;
};
