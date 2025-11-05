import { Spinner } from 'react-bootstrap';

import styles from './Loading.module.scss';

const BLOCK = 'loading';

export const Loading = () => {
	return (
		<div className={styles[BLOCK]}>
			<Spinner
				className={styles[`${BLOCK}__spinner`]}
				animation='grow'
				variant='secondary'
			/>
		</div>
	);
};
