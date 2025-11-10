import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Picture } from '@/components/Picture/Picture';
import type { TPictureProps } from '@/components/Picture/types';

function normalizedNextImage({ alt, fill: _fill, ...props }: any) {
	return <img {...props} alt={alt ?? ''} />;
}

jest.mock('next/image', () => normalizedNextImage);

describe('components/Picture/Picture', () => {
	it('renders an error icon when src is missing', () => {
		const { container } = render(
			<Picture {...({ alt: 'avatar' } as unknown as TPictureProps)} />
		);
		expect(container.querySelector('img')).toBeNull();
		expect(container.querySelector('svg')).not.toBeNull();
	});

	it('hides placeholder after image load and calls onLoad', () => {
		const onLoad = jest.fn();
		const { rerender } = render(<Picture alt='avatar' src='/test.png' />);
		const img = screen.getByRole('img');
		fireEvent.load(img);
		expect(onLoad).not.toHaveBeenCalled();

		rerender(<Picture alt='avatar' src='/test.png' onLoad={onLoad} />);
		const img2 = screen.getByRole('img');
		fireEvent.load(img2);
		expect(onLoad).toHaveBeenCalled();
	});

	it('sets hasError on image error and calls onError', () => {
		const onError = jest.fn();
		render(<Picture alt='avatar' src='/bad.png' onError={onError} />);

		const img = screen.getByRole('img');
		fireEvent.error(img);
		expect(onError).toHaveBeenCalled();
		expect(screen.getByRole('img')).toBeInTheDocument();
	});

	it('applies size mapping (md default -> 80x80)', () => {
		const { container } = render(<Picture alt='avatar' src='/size.png' />);
		const img = container.querySelector('img') as HTMLImageElement;
		expect(img).toBeTruthy();
		expect(img.getAttribute('width')).toBe('80');
		expect(img.getAttribute('height')).toBe('80');
	});

	it('uses fill prop when size="full"', () => {
		const { container } = render(
			<Picture alt='avatar' src='/full.png' size='full' sizes='100vw' />
		);
		const img = container.querySelector('img') as HTMLImageElement;
		expect(img.getAttribute('sizes')).toBe('100vw');
	});

	it('applies aspectRatio style when provided', () => {
		const { container } = render(
			<Picture alt='avatar' src='/ratio.png' aspectRatio='1/1' />
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper).toHaveStyle({ aspectRatio: '1/1' });
	});
});
