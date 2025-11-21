import type { TLocationDetails } from '@/types/location';

export type TLocationMapPolygon = {
	disabledBounds: [number, number][][];
	availableBounds: [number, number][];
};

export type TLocationMapProps = {
	onSuccessfulLocation?: (location: TLocationDetails) => void;
	className?: string;
	inputClassName?: string;
	mapClassName?: string;
	initialLocation?: TLocationDetails;
	showSearchControls?: boolean;
	isInteractive?: boolean;
	polygon: TLocationMapPolygon;
};
