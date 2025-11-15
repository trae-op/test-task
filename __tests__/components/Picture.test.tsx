import { fireEvent, render, screen } from '@testing-library/react';

import { Picture } from '@/components/Picture';

jest.mock('next/image', () => ({
	__esModule: true,
	default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
		<img {...props} />
	)
}));

describe('Picture', () => {
	test('renders placeholder error when src is missing', () => {
		render(<Picture size='md' src={undefined} alt='no-image' />);

		expect(screen.getAllByTestId('picture-error')[0]).toBeInTheDocument();
	});

	test('calls onLoad and hides loading placeholder', () => {
		const handleLoad = jest.fn();

		render(
			<Picture
				data-testid='picture-image'
				size='md'
				src='/test.png'
				alt='test'
				onLoad={handleLoad}
				width={80}
				height={80}
			/>
		);

		const img = screen.getByAltText('test');
		fireEvent.load(img);

		expect(handleLoad).toHaveBeenCalledTimes(1);
	});

	test('calls onError and shows error state', () => {
		const handleError = jest.fn();

		render(
			<Picture
				size='md'
				src='/test.png'
				alt='test'
				onError={handleError}
				width={80}
				height={80}
			/>
		);

		const img = screen.getByAltText('test');
		fireEvent.error(img);

		expect(handleError).toHaveBeenCalledTimes(1);
	});
});
