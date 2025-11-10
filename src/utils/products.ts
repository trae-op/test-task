import { getFullPathUploadPicture } from './upload-files';

type TFound = { id: string };

export function findChangedProducts({
	foundProducts,
	newProductIds
}: {
	foundProducts: TFound[];
	newProductIds: string[];
}): { toDisconnect: string[]; toConnect: string[]; hasChanges: boolean } {
	const current = new Set((foundProducts || []).map(p => String(p.id)));
	const next = new Set((newProductIds || []).map(String));

	const toDisconnect: string[] = [];
	const toConnect: string[] = [];

	for (const id of current) {
		if (!next.has(id)) toDisconnect.push(id);
	}
	for (const id of next) {
		if (!current.has(id)) toConnect.push(id);
	}

	const hasChanges = toDisconnect.length > 0 || toConnect.length > 0;
	return { toDisconnect, toConnect, hasChanges };
}

export function getPicturesByProducts(
	values:
		| {
				ok: boolean;
				code: string;
				items?: undefined;
		  }
		| {
				ok: boolean;
				items: {
					id: string;
					createdAt: Date;
					userId: string;
					productId: string;
					url: string;
					pictureId: string;
				}[];
				code?: undefined;
		  }
) {
	const picturesByProductId =
		values.ok && values.items !== undefined
			? Object.fromEntries(
					Object.entries(values.items).map(([_, pictureProduct]) => [
						pictureProduct.productId,
						pictureProduct.url
					])
				)
			: {};

	return (productId: string) => {
		return picturesByProductId[productId]
			? getFullPathUploadPicture({
					url: picturesByProductId[productId] || '',
					type: 'mini'
				})
			: null;
	};
}
