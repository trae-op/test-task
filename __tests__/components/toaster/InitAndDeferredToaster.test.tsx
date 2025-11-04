import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import toast from 'react-hot-toast';

import { DeferredToaster } from '@/components/Toaster/DeferredToaster';
import { InitToaster } from '@/components/Toaster/InitToaster';

// Ensure next-intl mock returns identity translator (provided in __mocks__)

// Polyfill matchMedia for react-hot-toast in JSDOM
beforeAll(() => {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: (query: string) => ({
			media: query,
			matches: false,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false
		})
	});
});

describe('components/Toaster/InitToaster', () => {
	it('renders success and error toasts with messages', async () => {
		render(<InitToaster />);

		await act(async () => {
			toast.success('Hello');
		});
		await waitFor(() => expect(screen.getByText('Hello')).toBeInTheDocument());

		await act(async () => {
			toast.error('Oops');
		});
		await waitFor(() => expect(screen.getByText('Oops')).toBeInTheDocument());
	});
});

describe('components/Toaster/DeferredToaster', () => {
	it('renders without crashing (client-only dynamic import)', () => {
		const { container } = render(<DeferredToaster />);
		expect(container).toBeTruthy();
	});
});
