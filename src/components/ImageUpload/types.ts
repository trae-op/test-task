import { TEntities, TImageOptions } from '@/types/imageUpload';

export type TResultUploadPicture = {
	message: string;
	data?: any;
	ok: boolean;
};

export type ImageUploadTProps = {
	imageOptions: TImageOptions;
	pendingUpload?: boolean;
	entity?: TEntities;
	handleSuccess?: (data: TResultUploadPicture) => void;
	handleBeforeSuccess?: () => void;
	handleFail?: () => void;
};
