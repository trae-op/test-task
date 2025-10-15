import { memo } from 'react';
import { Trash } from 'react-bootstrap-icons';

import styles from './DeleteButton.module.scss';
import type { TDeleteButtonProps } from './types';

const BLOCK = 'delete-button';

export const DeleteEntityButton = memo(({ id }: TDeleteButtonProps) => {
	return (
		<button type='button' className={styles[BLOCK]}>
			<Trash size={18} />
		</button>
	);
});
