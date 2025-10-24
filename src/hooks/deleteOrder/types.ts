export type TDeleteEntityParams = {
	id: string;
	cabSuccess?: () => void;
};

export type TActionsHook = {
	deleteEntity: (params: TDeleteEntityParams) => Promise<void>;
	pending: boolean;
};
