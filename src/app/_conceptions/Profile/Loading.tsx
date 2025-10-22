'use client';

import { Placeholder } from 'react-bootstrap';

import styles from './Profile.module.scss';

export const Loading = () => {
	return (
		<div className={`w-100 d-flex flex-column gap-2 ${styles.loading}`}>
			<Placeholder animation='glow' className='w-100 h-100'>
				<Placeholder className='w-100 h-100' />
			</Placeholder>

			<Placeholder animation='glow' className='w-100 h-100'>
				<Placeholder className='w-100 h-100' />
			</Placeholder>
		</div>
	);
};
