import {
	getFullPathUploadPicture,
	uploadsPictures
} from '@/utils/upload-files';

describe('uploadsPictures', () => {
	test('builds folder and fileName', () => {
		const result = uploadsPictures('123');
		expect(result.folder).toBe('uploads/test-task');
		expect(result.fileName).toBe('123');
	});
});

describe('getFullPathUploadPicture', () => {
	test('returns standard size by default', () => {
		const url = getFullPathUploadPicture({ url: 'http://example.com/img.jpg' });
		expect(url).toBe('http://example.com/img.jpg?tr=q-70,w-300,h-300');
	});

	test('returns mini size', () => {
		const url = getFullPathUploadPicture({ url: 'u', type: 'mini' });
		expect(url).toBe('u?tr=q-100,w-80,h-80');
	});

	test('returns big size', () => {
		const url = getFullPathUploadPicture({ url: 'u', type: 'big' });
		expect(url).toBe('u?tr=q-70,w-400,h-400');
	});
});
