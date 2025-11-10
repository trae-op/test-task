import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { ImageUpload } from '@/components/ImageUpload/ImageUpload';

const croppedFileMock = jest.fn(
	async () => new File([new Blob(['x'])], 'cropped.png', { type: 'image/png' })
);

jest.mock('@/utils/imageUpload', () => ({
	getCroppedImg: croppedFileMock
}));

const uploadPictureMock = jest.fn(async () => ({
	results: { ok: true, message: 'ok', data: { url: '/img.png' } }
}));

jest.mock('@/services/imageUpload', () => ({
	uploadPicture: uploadPictureMock
}));

const setToast = jest.fn();

jest.mock('@/components/Toaster/useActions', () => ({
	useActions: () => ({ setToast, setOptions: jest.fn() })
}));

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

const selectFileInput = (container: HTMLElement) =>
	container.querySelector('input[type="file"]') as HTMLInputElement;

const createImageFile = () =>
	new File([new Blob(['x'])], 'pic.png', { type: 'image/png' });

const waitForCropperVisible = async () => {
	await waitFor(() =>
		expect(screen.getByTestId('cropper')).toBeInTheDocument()
	);
};

const waitForCropperReady = async () => {
	await waitFor(() =>
		expect(screen.getByTestId('cropper').getAttribute('data-ready')).toBe(
			'true'
		)
	);
};

describe('components/ImageUpload', () => {
	class FileReaderMock {
		public result: string | ArrayBuffer | null = null;
		public onload: null | (() => void) = null;
		readAsDataURL(_file: File) {
			this.result = 'data:image/png;base64,TEST';
			if (this.onload) this.onload();
		}
	}

	beforeAll(() => {
		(globalThis as any).FileReader = FileReaderMock;
		class ResponseMock {
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
		(globalThis as any).Response = ResponseMock as unknown as typeof Response;
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

		const input = selectFileInput(container);
		const file = createImageFile();
		fireEvent.change(input, { target: { files: [file] } });

		await waitForCropperVisible();
		await waitForCropperReady();

		const apply = screen.getByRole('button', { name: 'Apply' });
		fireEvent.click(apply);

		await waitFor(() => expect(handleBeforeSuccess).toHaveBeenCalled());
		await waitFor(() => expect(handleSuccess).toHaveBeenCalled());
	});

	it('shows an error toast and calls handleFail on failure', async () => {
		const { uploadPicture } = jest.requireMock('@/services/imageUpload');
		uploadPicture.mockImplementationOnce(async () => {
			const responseError = new Response(
				JSON.stringify({ message: 'Failed' }),
				{ status: 400 }
			);
			throw responseError;
		});

		const handleFail = jest.fn();
		const { container } = render(
			<ImageUpload
				entity='profile'
				imageOptions={{ fileName: 'avatar', folder: 'profiles' }}
				handleFail={handleFail}
			/>
		);

		const input = selectFileInput(container);
		const file = createImageFile();
		fireEvent.change(input, { target: { files: [file] } });

		await waitForCropperReady();
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

		const input = selectFileInput(container);
		const file = createImageFile();
		fireEvent.change(input, { target: { files: [file] } });

		await waitForCropperVisible();

		const clearBtn = screen.getByRole('button', { name: 'Clear' });
		fireEvent.click(clearBtn);

		expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
	});
});
