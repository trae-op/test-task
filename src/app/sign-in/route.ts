import { getLocale } from 'next-intl/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const locale = await getLocale();
	const from = new URL(request.url);
	const to = new URL(`/${locale}/sign-in`, from);
	to.search = from.search; // preserve query params like ?callbackUrl=...
	return NextResponse.redirect(to);
}
