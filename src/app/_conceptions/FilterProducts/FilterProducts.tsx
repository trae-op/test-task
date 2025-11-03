'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { memo, useCallback, useMemo, useState } from 'react';
import { Spinner } from 'react-bootstrap';

import { SelectField } from '@/components/SelectField';

import { getProductsHref, getWithoutLocalePath } from '@/utils/routing';

type TOption = { value: string; label: string };

const OPTIONS: TOption[] = [
	{ value: '', label: 'All types' },
	{ value: 'phone', label: 'phone' },
	{ value: 'laptop', label: 'laptop' },
	{ value: 'monitor', label: 'monitor' }
];

export const FilterProducts = memo(() => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);

	const withoutLocalePath = useMemo(
		() => (pathname ? getWithoutLocalePath(pathname) : ''),
		[pathname]
	);
	const show = withoutLocalePath === getProductsHref;

	const currentType = searchParams.get('type') ?? '';

	const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
		event => {
			const value = event.target.value;

			if (value === currentType) {
				return;
			}

			const params = new URLSearchParams(searchParams.toString());

			if (!value) {
				params.delete('type');
			} else {
				params.set('type', value);
			}

			const queryString = params.toString();
			const url = queryString ? `${pathname}?${queryString}` : pathname;
			setLoading(true);
			router.push(url);
			router.refresh();
		},
		[currentType, pathname, router, searchParams]
	);

	if (!show) return null;
	return (
		<div className='d-flex align-items-center justify-content-center gap-1'>
			<SelectField
				options={OPTIONS}
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
