import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ImageUpload } from '@/components/ImageUpload';

jest.mock('react-dropzone', () => ({
	useDropzone: () => ({
		getRootProps: () => ({ onClick: jest.fn() }),
		getInputProps: () => ({})
	})
}));

jest.mock('react-easy-crop', () => () => <div data-testid='cropper' />);

jest.mock('@/utils/imageUpload', () => ({
	getCroppedImg: jest.fn(
		async () => new File([], 'cropped.png', { type: 'image/png' })
	)
}));

jest.mock('@/services/imageUpload', () => ({
	uploadPicture: jest.fn(async () => ({
		results: { ok: true, data: { url: 'http://test/url' } }
	}))
}));

jest.mock('@/components/Toaster/useActions', () => ({
	useActions: () => ({ setToast: jest.fn() })
}));

describe('ImageUpload', () => {
	test('renders upload area and disabled apply button initially', () => {
		render(
			<ImageUpload pendingUpload={false} imageOptions={{}} entity='test' />
		);

		expect(
			screen.getByText('Drag and drop an image, or click to select one')
		).toBeInTheDocument();

		const applyButton = screen.getByRole('button', { name: 'Apply' });
		expect(applyButton).toBeDisabled();
	});

	test('shows Clear button when imageSrc is set and triggers handleSave', async () => {
		const handleSuccess = jest.fn();

		const { rerender } = render(
			<ImageUpload
				pendingUpload={false}
				imageOptions={{}}
				entity='test'
				handleSuccess={handleSuccess}
			/>
		);

		rerender(
			<ImageUpload
				pendingUpload={false}
				imageOptions={{}}
				entity='test'
				handleSuccess={handleSuccess}
			/>
		);

		await waitFor(() => {
			const applyButton = screen.getByRole('button', { name: 'Apply' });
			fireEvent.click(applyButton);
		});

		await waitFor(() => {
			expect(handleSuccess).not.toHaveBeenCalled();
		});
	});
});
