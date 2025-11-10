'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { GroupBase, Props as ReactSelectProps } from 'react-select';

import { DropdownIndicator } from './DropdownIndicator';
import { defaultStyles } from './defaultStyles';
import type { OptionType, SelectFieldProps } from './types';

const LoadingPlaceholder = () => <div style={{ height: 38 }} />;

const Select = dynamic<
	ReactSelectProps<OptionType, true, GroupBase<OptionType>>
>(() => import('react-select'), {
	ssr: false,
	loading: LoadingPlaceholder
});

export const MultiSelectField = ({
	options,
	value,
	onChange,
	styles,
	...rest
}: SelectFieldProps) => {
	const mergeStyles = useMemo(() => {
		if (!styles) {
			return defaultStyles;
		}

		return {
			...defaultStyles,
			...styles
		};
	}, [styles]);

	return (
		<Select
			isMulti={true}
			options={options}
			value={value}
			onChange={onChange}
			styles={mergeStyles}
			components={{ DropdownIndicator }}
			{...rest}
		/>
	);
};
