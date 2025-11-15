import { getCroppedImg } from '@/utils/imageUpload';

describe('getCroppedImg', () => {
	test('creates a blob from cropped canvas', async () => {
		Object.defineProperty(global, 'Image', {
			value: class {
				public src = '';
				public naturalWidth = 100;
				public naturalHeight = 100;
				public width = 100;
				public height = 100;
			},
			writable: true
		});

		const toBlobMock = jest.fn(callback => {
			callback(new Blob());
		});

		Object.defineProperty(global.document, 'createElement', {
			value: () => ({
				getContext: () => ({ drawImage: jest.fn() }),
				toBlob: toBlobMock,
				width: 0,
				height: 0
			})
		});

		const blob = await getCroppedImg('src', {
			x: 0,
			y: 0,
			width: 50,
			height: 50
		});
		expect(blob).toBeInstanceOf(Blob);
	});
});
