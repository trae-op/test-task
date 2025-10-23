type TProductData = {
	id: string;
	title: string;
	serialNumber: string;
	photo: string;
	isNew: 0 | 1;
};

export type TOrderByIdData = {
	orderTitle: string;
	products: TProductData[];
};
