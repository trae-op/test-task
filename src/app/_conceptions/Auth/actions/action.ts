'use server';

import { hash } from 'bcryptjs';

import { EMAIL_PATTERN, PASSWORD_PATTERN, isValidName } from '@/utils/regExp';

import type { TSignUpInput, TSignUpResult } from './types';
import { prisma } from '@/prisma/prisma-client';

export const signUp = async (input: TSignUpInput): Promise<TSignUpResult> => {
	try {
		const email = String(input.email || '')
			.trim()
			.toLowerCase();
		const password = String(input.password || '');
		const confirmPassword = String(input.confirmPassword || '');
		const name = input.name?.trim();

		if (!EMAIL_PATTERN.test(email)) {
			return { ok: false, code: 'INVALID_INPUT' };
		}

		if (name && !isValidName(name)) {
			return { ok: false, code: 'INVALID_INPUT' };
		}

		if (!PASSWORD_PATTERN.test(password)) {
			return { ok: false, code: 'WEAK_PASSWORD' };
		}

		if (confirmPassword && password !== confirmPassword) {
			return { ok: false, code: 'PASSWORD_MISMATCH' };
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return { ok: false, code: 'USER_EXISTS' };
		}

		const passwordHash = await hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				name: name ?? null,
				password: passwordHash,
				provider: 'credentials'
			}
		});

		return { ok: true, userId: user.id };
	} catch {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
