import { Spinner } from 'react-bootstrap';

import styles from './LoadingPage.module.scss';

const BLOCK = 'loading';

export const LoadingPage = () => {
	return (
		<div className={styles[BLOCK]}>
			<Spinner
				className={`${styles[BLOCK]}__spinner`}
				animation='grow'
				variant='secondary'
			/>
		</div>
	);
};
