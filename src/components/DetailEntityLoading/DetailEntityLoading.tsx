'use client';

import clsx from 'clsx';
import { Placeholder } from 'react-bootstrap';

import styles from './DetailEntityLoading.module.scss';

const BLOCK = 'container-loading';

export const DetailEntityLoading = () => {
	return (
		<div
			data-testid='detail-entity-loading'
			className={clsx(styles[BLOCK], 'w-100 d-flex gap-2 my-5')}
		>
			<Placeholder animation='glow' className='w-100'>
				<Placeholder xs={5} className='w-100 h-100' />
			</Placeholder>

			<Placeholder animation='glow' className='w-100'>
				<Placeholder xs={7} className='w-100 h-100' />
			</Placeholder>
		</div>
	);
};
