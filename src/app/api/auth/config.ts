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
				} as any;
			}
		})
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			// Allow client-side session.update(...) to push fresh values into the JWT
			if (trigger === 'update' && session) {
				const nextName = (session as any).name ?? (session as any).user?.name;
				const nextEmail =
					(session as any).email ?? (session as any).user?.email;
				if (typeof nextName !== 'undefined') token.name = nextName as any;
				if (typeof nextEmail !== 'undefined') token.email = nextEmail as any;
			}
			if (user) {
				token.id = (user as any).id;
				token.name = user.name ?? token.name;
				token.email = user.email ?? token.email;
				token.picture = (user as any).image ?? token.picture;
				token.provider = (user as any).provider ?? 'credentials';
			} else if (token.email) {
				const dbUser = await prisma.user.findUnique({
					where: { email: token.email }
				});
				if (dbUser) {
					token.id = dbUser.id;
					token.name = dbUser.name ?? token.name;
					token.picture = dbUser.ava ?? token.picture;
					token.provider = dbUser.provider ?? 'credentials';
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				(session.user as any).id = (token as any).id;
				session.user.name = token.name ?? session.user.name ?? undefined;
				session.user.email = token.email ?? session.user.email ?? undefined;
				session.user.image =
					(token as any).picture ?? session.user.image ?? undefined;
				(session as any).provider = (token as any).provider ?? 'credentials';
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
