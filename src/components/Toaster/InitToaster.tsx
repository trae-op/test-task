'use client';

import { useTranslations } from 'next-intl';
import { Bug, CheckCircle } from 'react-bootstrap-icons';
import { ToastBar, Toaster } from 'react-hot-toast';

import styles from './Toaster.module.scss';

const BLOCK = 'toaster';

export const InitToaster = () => {
	const tm = useTranslations('App');

	return (
		<Toaster
			toastOptions={{
				duration: 4000,
				success: {
					style: {
						background: '#31782dff',
						color: 'white'
					}
				},
				error: {
					style: {
						background: 'red',
						color: 'white'
					}
				}
			}}
		>
			{t => (
				<ToastBar toast={t}>
					{({ message }) => (
						<div className={styles[BLOCK]}>
							<div className={styles[`${BLOCK}__container-icon`]}>
								{t.type === 'success' && <CheckCircle />}
								{t.type === 'error' && <Bug />}
							</div>

							{typeof message === 'string' ? tm(message) : message}
						</div>
					)}
				</ToastBar>
			)}
		</Toaster>
	);
};
