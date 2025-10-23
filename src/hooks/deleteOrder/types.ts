export type TActions = {
	deleteEntity: (id: string) => Promise<void>;
	pending: boolean;
};
