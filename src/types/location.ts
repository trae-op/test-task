export type TLatLng = {
	lat: number;
	lng: number;
};

export type TLocationDetails = TLatLng & {
	country?: string;
	state?: string;
	city?: string;
	district?: string;
	street?: string;
	postcode?: string;
	displayName?: string;
};

export type TLocationFormValue = TLocationDetails;
