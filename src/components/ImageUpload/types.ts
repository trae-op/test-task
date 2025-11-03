import { TEntities, TImageOptions } from '@/types/imageUpload';

export type TResultUploadPicture = {
	message: string;
	ok: boolean;
	data: {
		url: string;
		[key: string]: unknown;
	};
};

export type ImageUploadTProps = {
	imageOptions: TImageOptions;
	pendingUpload?: boolean;
	entity?: TEntities;
	handleSuccess?: (data: TResultUploadPicture) => void;
	handleBeforeSuccess?: () => void;
	handleFail?: () => void;
};
