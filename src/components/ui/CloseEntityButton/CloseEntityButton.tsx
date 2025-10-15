import clsx from 'clsx';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';

import styles from './CloseEntityButton.module.scss';
import { ActionButtonProps } from './types';

const BLOCK = 'action-btn';

export const CloseEntityButton = ({
	Icon,
	className = '',
	iconClassName = '',
	ariaLabelText,
	iconSize = 20,
	href = '/',
	...restProps
}: ActionButtonProps) => (
	<Button
		className={clsx(styles[BLOCK], className)}
		variant='light'
		aria-label={ariaLabelText}
		{...restProps}
	>
		<Link href={href} className='d-flex'>
			<X size={20} />
		</Link>
	</Button>
);
