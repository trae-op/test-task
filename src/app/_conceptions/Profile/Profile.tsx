'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Container } from 'react-bootstrap';

import { Loading } from '@/components/Loading';

import { useAuthActions } from '@/hooks/auth';

import { Info } from './Info';
import { UpdatePassword } from './UpdatePassword';

export const Profile = () => {
	const { signOut } = useAuthActions();
	const t = useTranslations('App');
	const { data: session } = useSession();

	const defaultValues = useMemo(() => {
		const name = session?.user?.name;
		const email = session?.user?.email;
		const id = session?.user?.id;

		if (!name || !email || !id) {
			return;
		}

		return {
			name,
			id,
			email
		};
	}, [session?.user?.name, session?.user?.email]);

	if (!defaultValues) {
		return <Loading />;
	}

	return (
		<Container className='py-3'>
			<div className='d-flex justify-content-end mb-3'>
				<button className='btn-outline-secondary btn' onClick={signOut}>
					{t('Sign Out')}
				</button>
			</div>

			<Info {...defaultValues} />
			<UpdatePassword />
		</Container>
	);
};
