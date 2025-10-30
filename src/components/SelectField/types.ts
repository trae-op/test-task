import React from 'react';

export interface SelectOption {
	value: string | number;
	label: string;
}

export interface SelectProps {
	options: SelectOption[];
	value?: string | number;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	placeholder?: string;
	className?: string;
	disabledOptions?: Array<SelectOption>;
}
