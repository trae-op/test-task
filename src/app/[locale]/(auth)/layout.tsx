import styles from './Layout.module.scss';

export default function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className={styles['auth-layout']}>{children}</div>;
}
