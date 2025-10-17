import React from 'react';

export const usePathname = () => '/';
export const getPathname = () => '/';
export const useRouter = () => ({ push: jest.fn(), replace: jest.fn() });
export const redirect = jest.fn();

export const Link: React.FC<React.ComponentProps<'a'>> = ({
	href = '#',
	children,
	...rest
}) =>
	React.createElement(
		'a',
		{ href: typeof href === 'string' ? href : '#', ...rest },
		children
	);
