import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import { XLg } from 'react-bootstrap-icons';

import styles from './CircleActionButton.module.scss';
import { CircleActionButtonProps } from './types';

const BLOCK = 'circle-action-btn';

export const CircleActionButton = ({
	Icon,
	className = '',
	iconClassName = '',
	ariaLabelText,
	iconSize = 20,
	children,
	...restProps
}: CircleActionButtonProps) => (
	<Button
		className={clsx(styles[BLOCK], className)}
		variant='light'
		aria-label={ariaLabelText}
		{...restProps}
	>
		{Icon !== undefined && (
			<Icon
				className={clsx(styles[`${BLOCK}__icon`], iconClassName)}
				size={iconSize}
			/>
		)}

		{children !== undefined && children}
	</Button>
);
