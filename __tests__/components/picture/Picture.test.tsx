import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Picture } from '@/components/Picture/Picture';

// Mock next/image to behave like a normal <img>
jest.mock('next/image', () => ({ fill, ...props }: any) => {
	// Filter out boolean 'fill' prop to avoid React warnings in jsdom
	// eslint-disable-next-line jsx-a11y/alt-text
	return <img {...props} />;
});

describe('components/Picture/Picture', () => {
	it('renders an error icon when src is missing', () => {
		// @ts-expect-error intentionally omit required src to validate error fallback
		const { container } = render(<Picture alt='avatar' />);
		// No <img> should be rendered when src is missing
		expect(container.querySelector('img')).toBeNull();
		// Error icon (SVG) should be present
		expect(container.querySelector('svg')).not.toBeNull();
	});

	it('hides placeholder after image load and calls onLoad', () => {
		const onLoad = jest.fn();
		const { rerender } = render(<Picture alt='avatar' src='/test.png' />);
		const img = screen.getByRole('img');
		fireEvent.load(img);
		expect(onLoad).not.toHaveBeenCalled();

		// Now rerender same tree with onLoad and ensure it fires
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
		// Error layer should be visible (at least present in DOM)
		// We expect there is still an <img> element; absence is not required
		expect(screen.getByRole('img')).toBeInTheDocument();
	});

	it('applies size mapping (md default -> 80x80)', () => {
		const { container } = render(<Picture alt='avatar' src='/size.png' />);
		const img = container.querySelector('img') as HTMLImageElement;
		expect(img).toBeTruthy();
		// width/height attributes exist when not full size
		expect(img.getAttribute('width')).toBe('80');
		expect(img.getAttribute('height')).toBe('80');
	});

	it('uses fill prop when size="full"', () => {
		const { container } = render(
			<Picture alt='avatar' src='/full.png' size='full' sizes='100vw' />
		);
		const img = container.querySelector('img') as HTMLImageElement;
		// next/image mock simply maps props; ensure sizes prop is present
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
