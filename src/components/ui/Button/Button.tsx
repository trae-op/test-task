import clsx from 'clsx';
import { Button as BaseButton } from 'react-bootstrap';

import styles from './Button.module.scss';
import type { ButtonProps, IconProps } from './types';

const BLOCK = 'base-button';

const Icon = ({ IconComponent, iconClassName }: IconProps) => {
	if (IconComponent === undefined) {
		return null;
	}

	return (
		<span className={clsx(styles[`${BLOCK}__icon-wrapper`])}>
			<IconComponent size={13} className={iconClassName} />
		</span>
	);
};

export const Button = ({
	text,
	IconComponent,
	className = '',
	iconClassName = '',
	textClassName = '',
	children,
	...rest
}: ButtonProps) => (
	<BaseButton
		className={clsx(styles[BLOCK], styles[`${BLOCK}--rounded`], className)}
		{...rest}
	>
		<Icon IconComponent={IconComponent} iconClassName={iconClassName} />
		<span className={textClassName}>
			{text}
			{children}
		</span>
	</BaseButton>
);
