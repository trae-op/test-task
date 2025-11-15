import { render, screen } from '@testing-library/react';

import { DeferredToaster } from '@/components/Toaster';

jest.mock('next/dynamic', () => () => () => (
	<div data-testid='init-toaster-mock' />
));

jest.mock('react-hot-toast', () => ({
	Toaster: ({
		children
	}: {
		children: (t: { type: string }) => JSX.Element;
	}) => <div data-testid='toaster-root'>{children({ type: 'success' })}</div>,
	ToastBar: ({
		children,
		toast
	}: {
		children: (args: { message: string }) => JSX.Element;
		toast: { message: string };
	}) => (
		<div data-testid='toast-bar'>{children({ message: toast.message })}</div>
	)
}));

jest.mock('next-intl', () => ({
	useTranslations: () => (value: string) => value
}));

describe('Toaster', () => {
	test('DeferredToaster renders mocked InitToaster via dynamic import', () => {
		render(<DeferredToaster />);

		expect(screen.getByTestId('init-toaster-mock')).toBeInTheDocument();
	});
});
