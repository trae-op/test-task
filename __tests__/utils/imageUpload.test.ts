import { getCroppedImg } from '@/utils/imageUpload';

describe('getCroppedImg', () => {
	const OriginalImage = global.Image;
	const originalCreateElement = global.document.createElement;

	beforeEach(() => {
		// Mock Image constructor with fixed dimensions
		(global as any).Image = class {
			width = 200;
			height = 100;
			naturalWidth = 400;
			naturalHeight = 200;
			src = '';
		} as any;

		// Mock canvas element with getContext and toBlob
		jest.spyOn(document, 'createElement').mockImplementation((tagName: any) => {
			if (tagName === 'canvas') {
				return {
					width: 0,
					height: 0,
					getContext: () => ({ drawImage: jest.fn() }),
					toBlob: (cb: (b: Blob | null) => void) =>
						cb(new Blob([new Uint8Array([1, 2, 3])], { type: 'image/jpeg' }))
				} as any;
			}
			return originalCreateElement.call(document, tagName);
		});
	});

	afterEach(() => {
		(global as any).Image = OriginalImage as any;
		jest.restoreAllMocks();
	});

	it('resolves a blob for valid crop', async () => {
		const crop = { x: 10, y: 5, width: 50, height: 40 } as const;
		const blob = await getCroppedImg('data:image/jpeg;base64,AAA', crop);
		expect(blob).toBeInstanceOf(Blob);
		expect(blob.type).toBe('image/jpeg');
	});

	it('rejects when canvas toBlob returns null', async () => {
		// Force toBlob to call back with null
		const createElSpy = jest.spyOn(document, 'createElement');
		createElSpy.mockImplementation((tagName: any) => {
			if (tagName === 'canvas') {
				return {
					width: 0,
					height: 0,
					getContext: () => ({ drawImage: jest.fn() }),
					toBlob: (cb: (b: Blob | null) => void) => cb(null)
				} as any;
			}
			return originalCreateElement.call(document, tagName);
		});

		await expect(
			getCroppedImg('data:image/jpeg;base64,AAA', {
				x: 0,
				y: 0,
				width: 10,
				height: 10
			} as any)
		).rejects.toThrow('Canvas is empty');
	});
});
