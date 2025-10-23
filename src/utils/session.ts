import { type User, getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/config';

export const getUserSession = async (): Promise<User | null> => {
	const session = await getServerSession(authOptions);

	return Promise.resolve(session?.user ?? null);
};
