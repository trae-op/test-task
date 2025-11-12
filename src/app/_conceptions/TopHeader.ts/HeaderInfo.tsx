import { Logo } from './Logo';
import styles from './styles/HeaderInfo.module.scss';

const HeaderInfo = () => (
	<div className={styles['header-info']}>
		<Logo />
	</div>
);

export { HeaderInfo };
