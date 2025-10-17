import React from 'react';

export const createNavigation = (routing: unknown) => {
	void routing;
	return {
		Link: ({ href = '#', children, ...rest }: React.ComponentProps<'a'>) =>
			React.createElement(
				'a',
				{ href: typeof href === 'string' ? href : '#', ...rest },
				children
			),
		redirect: jest.fn(),
		usePathname: () => '/',
		useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
		getPathname: () => '/'
	};
};
