'use client';

import { useAuthActions } from '@/hooks/auth';

export const Profile = () => {
	const { signOut } = useAuthActions();

	return (
		<div>
			<button onClick={signOut}>Sign Out</button>
		</div>
	);
};
