'use server';

import { compare, hash } from 'bcryptjs';
import { getServerSession } from 'next-auth';

import { PASSWORD_PATTERN } from '@/utils/regExp';

import { prisma } from '../../../prisma/prisma-client';

import type { TPasswordInput, TPasswordResult } from './types';
import { authOptions } from '@/app/api/auth/config';

export const updatePassword = async (
	input: TPasswordInput
): Promise<TPasswordResult> => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.email) return { ok: false, code: 'UNAUTHORIZED' };

		const oldPassword = String(input.oldPassword || '');
		const newPassword = String(input.newPassword || '');

		if (!PASSWORD_PATTERN.test(newPassword)) {
			return { ok: false, code: 'INVALID_INPUT' };
		}

		const dbUser = await prisma.user.findUnique({
			where: { email: session.user.email }
		});
		if (!dbUser || !dbUser.password) return { ok: false, code: 'UNAUTHORIZED' };

		const same = await compare(oldPassword, dbUser.password);
		if (!same) return { ok: false, code: 'WRONG_PASSWORD' };

		const hashed = await hash(newPassword, 10);
		await prisma.user.update({
			where: { id: dbUser.id },
			data: { password: hashed }
		});

		return { ok: true };
	} catch (e) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
