import { type TCreateParamsInput, type TParseQueryParamsInput } from './types';

// --- Deep collect params serialization ---
export const createParams = (input: TCreateParamsInput): string => {
	const query: string[] = [];
	if (input.id) query.push(`id=${encodeURIComponent(String(input.id))}`);
	if (input.type) query.push(`type=${encodeURIComponent(String(input.type))}`);
	if (input.fields && input.fields.length) {
		const flatFields: string[] = [];
		const nested: Record<string, string[]> = {};
		input.fields.forEach((field: string | Record<string, string[]>) => {
			if (typeof field === 'string') {
				flatFields.push(field);
			} else if (typeof field === 'object' && field !== null) {
				Object.entries(field).forEach(([key, value]) => {
					flatFields.push(key);
					if (Array.isArray(value)) {
						nested[`fields${capitalize(key)}`] = value.map(String);
					}
				});
			}
		});
		query.push(`fields=${flatFields.join(',')}`);
		Object.entries(nested).forEach(([k, v]) => {
			query.push(`${k}=${v.join(',')}`);
		});
	}
	return query.length ? `?${query.join('&')}` : '';
};

function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Deep query params parsing ---
// --- Query string to nested object ---
export const parseQueryParams = (query: string): Record<string, any> => {
	if (!query) return {};
	// Remove leading ? if present
	const clean = query.startsWith('?') ? query.slice(1) : query;
	const params = new URLSearchParams(clean);
	const result: Record<string, any> = {};
	// First, parse top-level fields
	const fields = params.get('fields');
	if (fields) {
		fields.split(',').forEach(f => {
			result[f] = true;
		});
	}
	// Now, parse nested fields (fieldsProducts, fieldsOrders, etc)
	params.forEach((value, key) => {
		if (key.startsWith('fields') && key !== 'fields') {
			// e.g. fieldsProducts => products
			const nestedKey = key.replace(/^fields/, '');
			const prop = nestedKey.charAt(0).toLowerCase() + nestedKey.slice(1);
			const nestedFields = value.split(',');
			result[prop] = {
				select: Object.fromEntries(nestedFields.map(f => [f, true]))
			};
		}
	});
	return result;
};

export const getProfileHref = '/profile';
export const getOrdersHref = '/orders';
export const getProductsHref = '/products';
export const getSignInHref = '/sign-in';
export const getSignUpHref = '/sign-up';
export const getAddProductHref = `${getProductsHref}/new`;
export const getAddOrderHref = `${getOrdersHref}/new`;
export const getOrderDetailHref = (id: string | number): string =>
	`${getOrdersHref}/${id}`;
export const getProductUpdateHref = (id: string | number): string =>
	`${getProductsHref}/${id}/update`;
export const getOrderUpdateHref = (id: string | number): string =>
	`${getOrdersHref}/${id}/update`;

// Resolve base URL from env in a simple, predictable way
export const getBaseUrl = (): string => {
	const envPublic = process.env.NEXT_PUBLIC_APP_URL;
	if (envPublic) return envPublic.replace(/\/$/, '');
	const vercelUrl = process.env.VERCEL_URL;
	if (vercelUrl) return `https://${vercelUrl}`;
	return process.env.NEXT_PUBLIC_APP_URL || '';
};

export const getApiUrl = (path: string): string => {
	const base = getBaseUrl();
	const p = path.startsWith('/') ? path : `/${path}`;
	return `${base}${p}`;
};

export const getWithoutLocalePath = (pathname: string): string =>
	pathname.replace(/^\/[a-zA-Z]{2}\//, '/');
