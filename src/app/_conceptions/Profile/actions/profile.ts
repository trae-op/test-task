'use server';

import { getServerSession } from 'next-auth';

import { EMAIL_PATTERN, isValidName } from '@/utils/regExp';

import type { TProfileInput, TProfileResult } from './types';
import { authOptions } from '@/app/api/auth/config';
import { prisma } from '@/prisma/prisma-client';

export const updateProfile = async (
	input: TProfileInput
): Promise<TProfileResult> => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.email) return { ok: false, code: 'UNAUTHORIZED' };

		const currentEmail = session.user.email;
		const name = input.name?.trim() ?? null;
		const email = String(input.email || '')
			.trim()
			.toLowerCase();

		if (!EMAIL_PATTERN.test(email)) {
			return { ok: false, code: 'INVALID_INPUT' };
		}
		if (name && !isValidName(name)) {
			return { ok: false, code: 'INVALID_INPUT' };
		}

		if (email !== currentEmail) {
			const exists = await prisma.user.findUnique({ where: { email } });
			if (exists) return { ok: false, code: 'EMAIL_TAKEN' };
		}

		const dbUser = await prisma.user.findUnique({
			where: { email: currentEmail }
		});
		if (!dbUser) return { ok: false, code: 'UNAUTHORIZED' };

		await prisma.user.update({
			where: { id: dbUser.id },
			data: {
				name: name ?? null,
				email
			}
		});

		return { ok: true, code: 'SUCCESS' };
	} catch {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
