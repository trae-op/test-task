import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { ImageUpload } from '@/components/ImageUpload/ImageUpload';

// Mock getCroppedImg util
jest.mock('@/utils/imageUpload', () => ({
	getCroppedImg: jest.fn(
		async () =>
			new File([new Blob(['x'])], 'cropped.png', { type: 'image/png' })
	)
}));

// Mock uploadPicture service
jest.mock('@/services/imageUpload', () => ({
	uploadPicture: jest.fn(async () => ({
		results: { ok: true, message: 'ok', data: { url: '/img.png' } }
	}))
}));

// Mock toaster actions to capture errors
const setToast = jest.fn();
jest.mock('@/components/Toaster/useActions', () => ({
	useActions: () => ({ setToast, setOptions: jest.fn() })
}));

// Mock react-easy-crop Cropper to call onCropComplete immediately
jest.mock('react-easy-crop', () => {
	const React = require('react');
	return {
		__esModule: true,
		default: (props: any) => {
			const [ready, setReady] = React.useState(false);
			React.useEffect(() => {
				const id = setTimeout(() => {
					props.onCropComplete?.(
						{ x: 0, y: 0, width: 100, height: 100 },
						{ x: 0, y: 0, width: 100, height: 100 }
					);
					setReady(true);
				}, 0);
				return () => clearTimeout(id);
			}, []);
			return (
				<div data-testid='cropper' data-ready={ready ? 'true' : 'false'} />
			);
		}
	};
});

describe('components/ImageUpload', () => {
	// Mock FileReader globally
	class MockFileReader {
		public result: string | ArrayBuffer | null = null;
		public onload: null | (() => void) = null;
		readAsDataURL(_file: File) {
			this.result = 'data:image/png;base64,TEST';
			if (this.onload) this.onload();
		}
	}

	beforeAll(() => {
		// @ts-ignore
		global.FileReader = MockFileReader as any;
		// Minimal Response polyfill for tests
		class MockResponse {
			status: number;
			private body: string;
			constructor(body: string, init: { status: number }) {
				this.body = body;
				this.status = init.status;
			}
			async json() {
				return JSON.parse(this.body);
			}
		}
		// @ts-ignore
		global.Response = MockResponse as any;
	});

	it('uploads a cropped image and calls handlers on success', async () => {
		const handleBeforeSuccess = jest.fn();
		const handleSuccess = jest.fn();

		const { container } = render(
			<ImageUpload
				entity='profile'
				imageOptions={{ fileName: 'avatar', folder: 'profiles' }}
				handleBeforeSuccess={handleBeforeSuccess}
				handleSuccess={handleSuccess}
			/>
		);

		const input = container.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		const file = new File([new Blob(['x'])], 'pic.png', { type: 'image/png' });
		fireEvent.change(input, { target: { files: [file] } });

		// Wait cropper to appear
		await waitFor(() =>
			expect(screen.getByTestId('cropper')).toBeInTheDocument()
		);

		// Wait for cropper to signal ready
		await waitFor(() =>
			expect(screen.getByTestId('cropper').getAttribute('data-ready')).toBe(
				'true'
			)
		);

		// Click Apply to trigger save
		const apply = screen.getByRole('button', { name: 'Apply' });
		fireEvent.click(apply);

		await waitFor(() => expect(handleBeforeSuccess).toHaveBeenCalled());
		await waitFor(() => expect(handleSuccess).toHaveBeenCalled());
	});

	it('shows an error toast and calls handleFail on failure', async () => {
		const { uploadPicture } = jest.requireMock('@/services/imageUpload');
		// Make it throw a Response with message
		uploadPicture.mockImplementationOnce(async () => {
			throw new Response(JSON.stringify({ message: 'Failed' }), {
				status: 400
			});
		});

		const handleFail = jest.fn();
		const { container } = render(
			<ImageUpload
				entity='profile'
				imageOptions={{ fileName: 'avatar', folder: 'profiles' }}
				handleFail={handleFail}
			/>
		);

		const input = container.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		const file = new File([new Blob(['x'])], 'pic.png', { type: 'image/png' });
		fireEvent.change(input, { target: { files: [file] } });

		// Ensure cropper ready then click Apply
		await waitFor(() =>
			expect(screen.getByTestId('cropper').getAttribute('data-ready')).toBe(
				'true'
			)
		);
		const apply = await screen.findByRole('button', { name: 'Apply' });
		fireEvent.click(apply);

		await waitFor(() =>
			expect(setToast).toHaveBeenCalledWith('400: Failed', 'error')
		);
		expect(handleFail).toHaveBeenCalled();
	});

	it('clears selected image on Clear button', async () => {
		const { container } = render(
			<ImageUpload
				entity='profile'
				imageOptions={{ fileName: 'avatar', folder: 'profiles' }}
			/>
		);

		const input = container.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		const file = new File([new Blob(['x'])], 'pic.png', { type: 'image/png' });
		fireEvent.change(input, { target: { files: [file] } });

		// Wait for cropper
		await waitFor(() =>
			expect(screen.getByTestId('cropper')).toBeInTheDocument()
		);

		// Clear
		const clearBtn = screen.getByRole('button', { name: 'Clear' });
		fireEvent.click(clearBtn);

		// Apply should be disabled now
		const apply = screen.getByRole('button', { name: 'Apply' });
		expect(apply).toBeDisabled();
	});
});
