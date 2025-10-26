export type TEntityId = string | number;

export type TCollectParams<T = string, F extends object = {}> = {
	entityId?: string;
	type?: T;
	fields?: Array<keyof F>;
};
