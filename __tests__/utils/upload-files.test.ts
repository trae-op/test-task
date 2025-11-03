import {
	getFullPathUploadPicture,
	uploadsPictures
} from '@/utils/upload-files';

describe('uploadsPictures', () => {
	it('returns folder and fileName', () => {
		expect(uploadsPictures('123')).toEqual({
			folder: 'uploads/test-task',
			fileName: '123'
		});
	});
});

describe('getFullPathUploadPicture', () => {
	const url = 'https://cdn.example.com/x.jpg';

	it('mini size', () => {
		expect(getFullPathUploadPicture({ url, type: 'mini' })).toBe(
			`${url}?tr=q-100,w-80,h-80`
		);
	});

	it('big size', () => {
		expect(getFullPathUploadPicture({ url, type: 'big' })).toBe(
			`${url}?tr=q-70,w-400,h-400`
		);
	});

	it('default standard size', () => {
		expect(getFullPathUploadPicture({ url })).toBe(
			`${url}?tr=q-70,w-300,h-300`
		);
	});
});
