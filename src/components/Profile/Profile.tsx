'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Container } from 'react-bootstrap';

import { useAuthActions } from '@/hooks/auth';
import type { TProfileFormData } from '@/hooks/profile/types';

import { Info } from './Info';
import { UpdatePassword } from './UpdatePassword';

export const Profile = () => {
	const { signOut } = useAuthActions();
	const t = useTranslations('App');
	const { data: session } = useSession();

	const defaultValues: TProfileFormData | undefined = useMemo(() => {
		const name = session?.user?.name;
		const email = session?.user?.email;

		if (!name || !email) {
			return;
		}

		return {
			name,
			email
		};
	}, [session?.user?.name, session?.user?.email]);

	if (!defaultValues) {
		return null;
	}

	return (
		<Container className='py-3'>
			<div className='d-flex justify-content-end mb-3'>
				<button className='btn btn-outline-secondary' onClick={signOut}>
					{t('Profile.signOut')}
				</button>
			</div>
			<Info {...defaultValues} />
			<UpdatePassword />
		</Container>
	);
};
