import clsx from 'clsx';
import { memo } from 'react';
import { Trash } from 'react-bootstrap-icons';

import styles from './DeleteButton.module.scss';
import type { TDeleteButtonProps } from './types';

const BLOCK = 'delete-button';

export const DeleteEntityButton = memo(
	({ className, children, ...rest }: TDeleteButtonProps) => {
		return (
			<button
				type='button'
				className={clsx(
					styles[BLOCK],
					'd-flex align-items-center justify-content-center border-0 bg-transparent w-100 h-100',
					className
				)}
				aria-label='Delete'
				{...rest}
			>
				{children ?? <Trash size={18} />}
			</button>
		);
	}
);
