import { render, screen } from '@testing-library/react';

import { MessagesServer } from '@/components/MessagesServer';

describe('MessagesServer', () => {
	test('returns null when message is empty', () => {
		const { container } = render(<MessagesServer message='' type='error' />);

		expect(container).toBeEmptyDOMElement();
	});

	test('renders error message with error styling', () => {
		const messageKey = 'Some error';

		render(<MessagesServer message={messageKey} type='error' />);

		const message = screen.getByText(messageKey);
		expect(message).toBeInTheDocument();
		expect(message).toHaveClass('text-danger');
	});

	test('renders success message with success styling', () => {
		const messageKey = 'Success message';

		render(<MessagesServer message={messageKey} type='success' />);

		const message = screen.getByText(messageKey);
		expect(message).toBeInTheDocument();
		expect(message).toHaveClass('text-success');
	});
});
