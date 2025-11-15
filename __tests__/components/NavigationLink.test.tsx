import { render, screen } from '@testing-library/react';

import { NavigationLink } from '@/components/NavigationLink';

jest.mock('@/i18n/navigation', () => ({
	Link: ({
		href,
		children,
		...rest
	}: {
		href: string;
		children: React.ReactNode;
	}) => (
		<a href={href} {...rest}>
			{children}
		</a>
	),
	usePathname: () => '/current/path'
}));

type TestComponentProps = {
	isActive: boolean;
	text?: string;
};

const TestComponent = ({ isActive, text }: TestComponentProps) => (
	<span data-testid='navigation-link-component'>
		{String(isActive)}-{text}
	</span>
);

describe('NavigationLink', () => {
	test('renders children when provided without component or text', () => {
		render(
			<NavigationLink href='/test'>
				<span data-testid='inner-child'>Child</span>
			</NavigationLink>
		);

		const link = screen.getByRole('link');
		expect(link).toBeInTheDocument();
		expect(screen.getByTestId('inner-child')).toBeInTheDocument();
	});

	test('renders text when component is not provided', () => {
		const text = 'Go to page';

		render(<NavigationLink href='/test' text={text} />);

		const link = screen.getByRole('link');
		expect(link).toBeInTheDocument();
		expect(link).toHaveTextContent(text);
	});

	test('renders component with isActive prop', () => {
		render(
			<NavigationLink href='/current' component={TestComponent} text='Link' />
		);

		const component = screen.getByTestId('navigation-link-component');
		expect(component).toBeInTheDocument();
	});
});
