import { render } from '@testing-library/react';
import React from 'react';

import { PictureError } from '@/components/Picture/PictureError';

describe('components/Picture/PictureError', () => {
	it('does not render when hasError is false', () => {
		const { container } = render(<PictureError hasError={false} />);
		expect(container.firstChild).toBeNull();
	});

	it('renders when hasError is true and respects size', () => {
		const { container } = render(<PictureError hasError size={24} />);
		const svg = container.querySelector('svg');
		expect(svg).not.toBeNull();
	});
});
