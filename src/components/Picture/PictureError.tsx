import clsx from 'clsx';
import { ExclamationCircle } from 'react-bootstrap-icons';

import styles from './Picture.module.scss';

const BLOCK = 'picture';

export const PictureError = ({
	size,
	hasError,
	className
}: {
	size?: string | number;
	hasError: boolean;
	className?: string;
}) => {
	if (!hasError) return null;
	return (
		<div className={clsx(styles[`${BLOCK}__error`], className)}>
			<ExclamationCircle
				size={size}
				className={styles[`${BLOCK}__error-icon`]}
			/>
		</div>
	);
};
