type TAssociatedImages = {
	folder: string;
	fileName: string;
};

type TFullPathAssociatedImage = {
	id: string;
	name: string;
	type?: 'mini' | 'standard' | 'big';
};

export const uploadsPictures = (id: string): TAssociatedImages => {
	return {
		folder: 'uploads/test-task',
		fileName: id
	};
};

export const getFullPathUploadPicture = ({
	id,
	type = 'standard',
	name
}: TFullPathAssociatedImage): string => {
	const mainUrl = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_URL;

	if (type === 'mini') {
		return `${mainUrl}/${uploadsPictures(id).folder}/${name}?tr=q-100,w-80,h-80`;
	}

	if (type === 'big') {
		return `${mainUrl}/${uploadsPictures(id).folder}/${name}?tr=q-70,w-400,h-400`;
	}

	return `${mainUrl}/${uploadsPictures(id).folder}/${name}?tr=q-70,w-300,h-300`;
};
