export type TDynamicPageParams = {
	id: string;
	locale: string;
};

export type TDynamicPageProps = {
	params: Promise<TDynamicPageParams>;
};
