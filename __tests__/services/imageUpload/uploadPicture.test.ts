import { uploadPicture } from '@/services/imageUpload';

jest.mock('@/utils/api', () => ({
	getFetch: jest.fn()
}));

const { getFetch } = jest.requireMock('@/utils/api');

describe('services/imageUpload/uploadPicture', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('delegates to getFetch with FormData payload', async () => {
		const response = { ok: true, data: { id: 'img-1' } };
		(getFetch as jest.Mock).mockResolvedValue(response);
		const formData = new FormData();
		formData.set('file', 'blob');

		const result = await uploadPicture<{ id: string }>('/api/upload', formData);

		expect(getFetch).toHaveBeenCalledWith('/api/upload', {
			method: 'POST',
			body: formData,
			headers: {}
		});
		expect(result).toBe(response);
	});
});
