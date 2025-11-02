'use client';

import { usePathname } from 'next/navigation';

import { getProductsHref, getWithoutLocalePath } from '@/utils/routing';

import { FilterProducts } from './FilterProducts';

export const FilterProductsWrapper = () => {
	const pathname = usePathname();
	const withoutLocale = getWithoutLocalePath(pathname);
	return withoutLocale === getProductsHref ? <FilterProducts /> : null;
};
