import { compare } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { EMAIL_PATTERN, PASSWORD_PATTERN } from '@/utils/regExp';

import { prisma } from '@/prisma/prisma-client';

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
		maxAge: 60 * 60 * 24 * 7
	},
	jwt: {
		maxAge: 60 * 60 * 24 * 7
	},
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials) return null;

				const email = String(credentials.email || '')
					.trim()
					.toLowerCase();
				const password = String(credentials.password || '');

				if (!EMAIL_PATTERN.test(email)) return null;
				if (!PASSWORD_PATTERN.test(password)) return null;

				const user = await prisma.user.findUnique({ where: { email } });
				if (!user || !user.password) return null;

				const isValid = await compare(password, user.password);
				if (!isValid) return null;

				return {
					id: user.id,
					email: user.email,
					name: user.name ?? undefined,
					image: user.ava ?? undefined,
					provider: user.provider ?? 'credentials'
				} as unknown as import('next-auth').User & { provider: string };
			}
		})
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			const t = token as { [key: string]: unknown } & {
				id?: string;
				picture?: string;
				provider?: string;
			};

			if (trigger === 'update' && session) {
				const s = session as Partial<{
					name?: string;
					email?: string;
					user?: { name?: string; email?: string };
				}>;
				const nextName = s.name ?? s.user?.name;
				const nextEmail = s.email ?? s.user?.email;
				if (typeof nextName !== 'undefined') token.name = nextName ?? null;
				if (typeof nextEmail !== 'undefined') token.email = nextEmail ?? null;
			}
			if (user) {
				const u = user as Partial<{
					id: string;
					image?: string;
					provider?: string;
				}>;
				t.id = u.id;
				token.name = user.name ?? token.name;
				token.email = user.email ?? token.email;
				t.picture = u.image ?? (token as { picture?: string }).picture;
				t.provider = u.provider ?? 'credentials';
			} else if (token.email) {
				const dbUser = await prisma.user.findUnique({
					where: { email: token.email }
				});
				if (dbUser !== null) {
					t.id = dbUser.id;
					token.name = dbUser.name ?? token.name;
					t.picture = dbUser.ava ?? (token as { picture?: string }).picture;
					t.provider = dbUser.provider ?? 'credentials';
				} else {
					delete t.id;
					delete token.email;
					delete token.name;
					delete t.picture;
					delete t.provider;
				}
			} else {
				delete t.id;
				delete token.email;
				delete token.name;
				delete t.picture;
				delete t.provider;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				(session.user as { id?: string }).id = (token as { id?: string }).id;
				session.user.name = token.name ?? session.user.name ?? undefined;
				session.user.email = token.email ?? session.user.email ?? undefined;
				session.user.image =
					(token as { picture?: string }).picture ??
					session.user.image ??
					undefined;
				(session as { provider?: string }).provider =
					(token as { provider?: string }).provider ?? 'credentials';
			}
			return session;
		}
	},
	pages: {
		signIn: '/sign-in'
	},
	theme: {
		colorScheme: 'auto'
	},
	debug: process.env.NODE_ENV === 'development'
};
