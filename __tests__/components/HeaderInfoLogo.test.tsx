import { render, screen } from '@testing-library/react';

import { HeaderInfo } from '@/components/TopHeader.ts/HeaderInfo';
import { Logo } from '@/components/TopHeader.ts/Logo';

describe('components/TopHeader/HeaderInfo & Logo', () => {
	it('HeaderInfo shows title', () => {
		render(<HeaderInfo title='TITLE' />);
		expect(screen.getByText('TITLE')).toBeInTheDocument();
	});

	it('Logo renders svg element', () => {
		const { container } = render(<Logo />);
		expect(container.querySelector('svg')).toBeTruthy();
	});
});
