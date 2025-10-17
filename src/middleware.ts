export { default } from 'next-auth/middleware';

export const config = {
	matcher: [
		'/:locale([a-z]{2,})/orders/:path*',
		'/:locale([a-z]{2,})/products/:path*',
		'/:locale([a-z]{2,})/profile/:path*'
	]
};
