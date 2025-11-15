import { uploadPicture } from '@/services/imageUpload';

import { getFetch } from '@/utils/api';

jest.mock('@/utils/api', () => ({
	getFetch: jest.fn()
}));

const mockedGetFetch = getFetch as unknown as jest.MockedFunction<
	typeof getFetch
>;

describe('imageUpload service', () => {
	test('uploadPicture delegates to getFetch with POST and formData', async () => {
		const formData = new FormData();
		formData.append('file', new Blob(['data']), 'file.jpg');
		mockedGetFetch.mockResolvedValue({ results: { ok: true } });

		const result = await uploadPicture<{ ok: boolean }>('pictures', formData);

		expect(mockedGetFetch).toHaveBeenCalledWith('pictures', {
			method: 'POST',
			body: formData,
			headers: {}
		});
		expect(result.results.ok).toBe(true);
	});
});
