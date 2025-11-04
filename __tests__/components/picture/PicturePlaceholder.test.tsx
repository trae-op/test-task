import { render } from '@testing-library/react';
import React from 'react';

import { PicturePlaceholder } from '@/components/Picture/PicturePlaceholder';

describe('components/Picture/PicturePlaceholder', () => {
	it('does not render when isLoading is false', () => {
		const { container } = render(<PicturePlaceholder isLoading={false} />);
		expect(container.firstChild).toBeNull();
	});

	it('renders placeholder when isLoading is true', () => {
		const { container } = render(<PicturePlaceholder isLoading />);
		expect(container.querySelector('.placeholder-glow')).not.toBeNull();
	});
});
