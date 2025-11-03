export type TDefaultOptions = {
	baseURL?: string;
	headers?: HeadersInit;
};

export type TApiResults<T> = {
	results: T;
};

export interface TOptions extends RequestInit {
	isFullPath?: boolean;
	isToken?: boolean;
}
