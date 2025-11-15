import { render } from '@testing-library/react';

import { Loading } from '@/components/Loading';

describe('Loading', () => {
	test('renders spinner element', () => {
		const { container } = render(<Loading />);

		const spinner = container.querySelector('.loading__spinner');
		expect(spinner).not.toBeNull();
	});
});
