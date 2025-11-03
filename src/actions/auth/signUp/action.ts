'use server';

import { compare, hash } from 'bcryptjs';

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
			if (existing.password) {
				const same = await compare(password, existing.password);
				if (!same) {
					return { ok: false, code: 'WRONG_PASSWORD' };
				}
				return { ok: false, code: 'USER_EXISTS' };
			}
			if (!existing.password && password) {
				const hashed = await hash(password, 10);
				const updated = await prisma.user.update({
					where: { id: existing.id },
					data: {
						password: hashed,
						name: name ?? existing.name,
						provider: 'credentials'
					}
				});
				return { ok: true, userId: updated.id };
			}
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
