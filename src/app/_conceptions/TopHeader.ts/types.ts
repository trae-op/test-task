import type { ReactNode } from 'react';

export type TTopHeaderProps = {
	onSearch?: (value: string) => void;
	startContentComponent?: ReactNode;
};

export type TLogoProps = {
	className?: string;
};

export type TSearchBarProps = {
	placeholder?: string;
	onSearch?: (value: string) => void;
};

export type TDateTimeDisplayProps = {
	date: Date;
};
