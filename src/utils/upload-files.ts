type TAssociatedImages = {
	folder: string;
	fileName: string;
};

type TFullPathAssociatedImage = {
	url: string;
	type?: 'mini' | 'standard' | 'big';
};

export const uploadsPictures = (id: string): TAssociatedImages => {
	return {
		folder: 'uploads/test-task',
		fileName: id
	};
};

export const getFullPathUploadPicture = ({
	type = 'standard',
	url
}: TFullPathAssociatedImage): string => {
	if (type === 'mini') {
		return `${url}?tr=q-100,w-80,h-80`;
	}

	if (type === 'big') {
		return `${url}?tr=q-70,w-400,h-400`;
	}

	return `${url}?tr=q-70,w-300,h-300`;
};
