'use client';

import { useTranslations } from 'next-intl';
import { Container } from 'react-bootstrap';

import { useAuthActions } from '@/hooks/auth';

import { Info } from './Info';
import { UpdatePassword } from './UpdatePassword';

export const Profile = () => {
	const { signOut } = useAuthActions();
	const t = useTranslations('App');

	return (
		<Container className='py-3'>
			<div className='d-flex justify-content-end mb-3'>
				<button className='btn btn-outline-secondary' onClick={signOut}>
					{t('Profile.signOut')}
				</button>
			</div>
			<Info />
			<UpdatePassword />
		</Container>
	);
};
