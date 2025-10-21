import clsx from 'clsx';
import { Button as BaseButton } from 'react-bootstrap';

import styles from './Button.module.scss';
import type { ButtonProps, IconProps } from './types';

const BLOCK = 'base-button';

const Icon = ({ IconComponent, iconClassName, iconSize }: IconProps) => {
	if (IconComponent === undefined) {
		return null;
	}

	return <IconComponent size={iconSize} className={iconClassName} />;
};

export const Button = ({
	text,
	IconComponent,
	className = '',
	iconClassName = '',
	textClassName = '',
	children,
	iconSize,
	...rest
}: ButtonProps) => (
	<BaseButton
		className={clsx(
			'd-flex align-items-center justify-content-center',
			styles[BLOCK],
			styles[`${BLOCK}--rounded`],
			className
		)}
		{...rest}
	>
		<Icon
			iconSize={iconSize}
			IconComponent={IconComponent}
			iconClassName={iconClassName}
		/>
		{text !== undefined && (
			<span className={textClassName}>
				{text}
				{children}
			</span>
		)}
	</BaseButton>
);
