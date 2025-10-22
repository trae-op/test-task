import { headers } from 'next/headers';

import type { TCheckPathnameConfig, TCheckPathnamesResult } from './types';

const capitalize = (s: string): string =>
	s.charAt(0).toUpperCase() + s.slice(1);

export const checkPathnames = async <T = unknown>(
	configs: TCheckPathnameConfig<T>[]
): Promise<TCheckPathnamesResult | undefined> => {
	if (!configs || configs.length === 0) {
		return;
	}
	const getHeaders = await headers();
	const rawPath =
		getHeaders.get('x-middleware-request-url') ||
		getHeaders.get('x-invoke-path') ||
		getHeaders.get('referer') ||
		'';
	const raw = typeof rawPath === 'string' ? rawPath : '';

	let pathname = raw;
	try {
		if (raw.startsWith('http')) pathname = new URL(raw).pathname;
	} catch (_error) {
		return;
	}
	const segments = pathname.split('/').filter(Boolean);
	let currentPathname = '';
	// Find first matching config via for...of
	let matched: TCheckPathnameConfig<T> | undefined;
	for (const cfg of configs) {
		if (segments.includes(cfg.pathname)) {
			currentPathname = cfg.pathname;
			matched = cfg;
			break;
		}
	}

	const active = matched ?? configs[0];
	const section = active?.pathname || undefined;

	if (section === undefined) {
		return;
	}

	let href = `/${section}/new`;
	let displayTitle = capitalize(section);
	let displayTotal = 0;

	if (active?.fetch) {
		try {
			const items = await active.fetch();

			displayTotal = Array.isArray(items) ? items.length : 0;
		} catch (_error) {
			return;
		}
	}

	return { href, displayTitle, displayTotal, currentPathname };
};
