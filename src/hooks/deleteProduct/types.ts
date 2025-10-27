export type TDeleteEntityParams = {
	id: string;
	onSuccess?: () => void;
};

export type TActionsHook = {
	deleteEntity: (params: TDeleteEntityParams) => Promise<void>;
};
