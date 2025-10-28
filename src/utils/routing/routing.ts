import type { TCollectParams, TEntityId } from './types';

export const getCollectParams = <T = string, F extends object = {}>(
	params?: TCollectParams<T, F>
): string => {
	const query: string[] = [];
	if (params?.id) query.push(`id=${encodeURIComponent(String(params.id))}`);
	if (params?.type)
		query.push(`type=${encodeURIComponent(String(params.type))}`);
	if (params?.fields && params.fields.length)
		query.push(
			`fields=${params.fields.map(String).map(encodeURIComponent).join(',')}`
		);
	return query.length ? `?${query.join('&')}` : '';
};

export const getOrderDetailHref = (id: TEntityId): string => `/orders/${id}`;
export const getProfileHref = '/profile';
export const getOrdersHref = '/orders';
export const getProductsHref = '/products';
export const getSignInHref = '/sign-in';
export const getSignUpHref = '/sign-up';
export const getAddProductHref = `${getProductsHref}/new`;
export const getAddOrderHref = `${getOrdersHref}/new`;

// API paths
export const API_PRODUCTS_PATH = '/api/products';
export const API_ORDERS_PATH = '/api/orders';

// Resolve base URL from env in a simple, predictable way
export const getBaseUrl = (): string => {
	// Prefer explicit public app URL for both server/client usage
	const envPublic = process.env.NEXT_PUBLIC_APP_URL;
	if (envPublic) return envPublic.replace(/\/$/, '');

	// Vercel provides VERCEL_URL (without protocol)
	const vercelUrl = process.env.VERCEL_URL;
	if (vercelUrl) return `https://${vercelUrl}`;

	// Fallback for local development
	return process.env.NEXT_PUBLIC_APP_URL || '';
};

export const getApiUrl = (path: string): string => {
	const base = getBaseUrl();
	const p = path.startsWith('/') ? path : `/${path}`;
	return `${base}${p}`;
};
