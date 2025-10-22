import type { TEntityId } from './types';

export const getOrderDetailHref = (id: TEntityId): string => `/orders/${id}`;
export const getProfileHref = (): string => '/profile';
export const getOrdersHref = (): string => '/orders';
export const getSignInHref = (): string => '/sign-in';
export const getSignUpHref = (): string => '/sign-up';
export const getAddProductHref = (): string => '/add-product';
export const getAddOrderHref = (): string => '/add-order';

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
	return 'http://localhost:3000';
};

export const getApiUrl = (path: string): string => {
	const base = getBaseUrl();
	const p = path.startsWith('/') ? path : `/${path}`;
	return `${base}${p}`;
};
