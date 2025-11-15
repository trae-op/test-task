import { render, screen } from '@testing-library/react';

import { AlertError } from '@/components/AlertError';

describe('AlertError', () => {
	test('renders translated title and custom text', () => {
		const text = 'Server error occurred';

		render(<AlertError text={text} />);

		expect(
			screen.getByText('Something wrong with server!!!')
		).toBeInTheDocument();
		expect(screen.getByText(text)).toBeInTheDocument();
	});
});
