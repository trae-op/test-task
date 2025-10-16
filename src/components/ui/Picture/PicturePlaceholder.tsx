import { Placeholder } from 'react-bootstrap';

import styles from './Picture.module.scss';

const BLOCK = 'picture';

export const PicturePlaceholder = ({ isLoading }: { isLoading: boolean }) => {
	if (!isLoading) return null;
	return (
		<div className={styles[`${BLOCK}__placeholder`]}>
			<Placeholder
				animation='glow'
				className={styles[`${BLOCK}__placeholder-content`]}
			/>
		</div>
	);
};
