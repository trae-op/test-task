'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { GroupBase, Props as ReactSelectProps } from 'react-select';

import { DropdownIndicator } from './DropdownIndicator';
import { defaultStyles } from './defaultStyles';
import type { OptionType, SelectFieldProps } from './types';

// Lazy-load react-select on the client to reduce initial bundle size
const Select = dynamic(() => import('react-select'), {
	ssr: false,
	// lightweight fallback placeholder with roughly the control height
	loading: () => <div style={{ height: 38 }} />
});

// Preserve strong typing for consumers while passing props to the dynamic component
type SelectProps = ReactSelectProps<OptionType, true, GroupBase<OptionType>>;
const TypedSelect = (props: SelectProps) => {
	const Component = Select as unknown as React.ComponentType<any>;
	return <Component {...(props as any)} />;
};

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
		<TypedSelect
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
