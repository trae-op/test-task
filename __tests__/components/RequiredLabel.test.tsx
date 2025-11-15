import { render, screen } from '@testing-library/react';

import { RequiredLabel } from '@/components/RequiredLabel';

describe('RequiredLabel', () => {
	test('renders label text and required asterisk', () => {
		const text = 'Name';

		render(<RequiredLabel text={text} />);

		const label = screen.getByText(text);
		expect(label).toBeInTheDocument();
		expect(screen.getByText('*')).toBeInTheDocument();
	});
});
