import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';

import styles from './AddEntityButton.module.scss';
import { TAddEntityButtonProps } from './types';

const BLOCK = 'add-entity-btn';

export const AddEntityButton = ({
	className = '',
	iconClassName = '',
	ariaLabelText,
	iconSize = 20,
	...restProps
}: TAddEntityButtonProps) => (
	<Button
		className={clsx(styles[BLOCK], className)}
		variant='light'
		aria-label={ariaLabelText}
		{...restProps}
	>
		<PlusLg
			className={clsx(styles[`${BLOCK}__icon`], iconClassName)}
			size={iconSize}
		/>
	</Button>
);
