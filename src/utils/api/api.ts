import { getApiUrl } from '@/utils/routing';

import type { TApiResults, TOptions } from './types';

export async function getFetch<T>(
	pathname: string,
	options: TOptions = {},
	headers?: HeadersInit
): Promise<TApiResults<T>> {
	const mergedOptions: RequestInit = {
		headers: {
			...headers,
			'Content-Type': 'application/json'
		},
		...options
	};

	const isFullPath: boolean = Boolean(options.isFullPath);
	const url = getApiUrl(`/api/${pathname}`);
	return await fetch(isFullPath ? pathname : url, mergedOptions)
		.then(response => {
			if (response.status >= 400) {
				throw response;
			}
			return response.text().then(data => {
				return data ? JSON.parse(data) : {};
			});
		})
		.then(results => ({ results }));
}
