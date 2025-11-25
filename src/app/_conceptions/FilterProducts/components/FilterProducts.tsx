'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';

import { SelectField } from '@/components/SelectField';

import { getProductsHref, getWithoutLocalePath } from '@/utils/routing';

import { useProductTypesSelector } from '@/context/global/useSelectors';

const usePrevCurrentType = (value: string): string => {
	const ref = useRef('');
	useEffect(() => {
		ref.current = value;
	});

	return ref.current;
};

export const FilterProducts = memo(() => {
	const startControlRefresh = useRef(false);
	const productTypes = useProductTypesSelector();
	const t = useTranslations('App');
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const currentType = useMemo(
		() => searchParams?.get('type') ?? '',
		[searchParams]
	);
	const prevCurrentType = usePrevCurrentType(currentType);

	const withoutLocalePath = useMemo(
		() => (pathname ? getWithoutLocalePath(pathname) : ''),
		[pathname]
	);

	const options = useMemo(() => {
		return productTypes?.map(({ value, title }) => ({
			value,
			label: title
		}));
	}, [productTypes]);

	const show = withoutLocalePath === getProductsHref;

	const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
		event => {
			const value = event.target.value;

			if (value === currentType) {
				return;
			}

			const params = new URLSearchParams(searchParams?.toString() ?? '');

			if (!value) {
				params.delete('type');
			} else {
				params.set('type', value);
			}

			const queryString = params.toString();
			const url = queryString ? `${pathname}?${queryString}` : pathname;
			setLoading(true);

			if (url !== null && !startControlRefresh.current) {
				router.push(url);
				router.refresh();
				startControlRefresh.current = true;
			}
		},
		[currentType, pathname, router, searchParams]
	);

	useEffect(() => {
		if (
			!startControlRefresh.current &&
			prevCurrentType &&
			prevCurrentType !== currentType
		) {
			setLoading(true);
			router.refresh();
			startControlRefresh.current = true;
		}
	}, [currentType, prevCurrentType]);

	if (!show) return null;

	return (
		<div className='d-flex align-items-center justify-content-center gap-1'>
			<SelectField
				defaultOption={{
					value: '',
					label: t('All types')
				}}
				options={options || []}
				value={currentType}
				onChange={handleChange}
			/>
			{loading && (
				<Spinner
					className='ms-2'
					size='sm'
					animation='grow'
					variant='secondary'
				/>
			)}
		</div>
	);
});
