import { memo } from 'react';

import { Logo } from './Logo';
import styles from './styles/HeaderInfo.module.scss';
import { THeaderInfoProps } from './types';

const HeaderInfo = memo((props: THeaderInfoProps) => {
	const { title } = props;

	return (
		<div className={styles['header-info']}>
			<Logo />
			<span className={styles['header-info__title']}>{title}</span>
		</div>
	);
});

export { HeaderInfo };
