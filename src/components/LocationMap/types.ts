import type { TLocationDetails } from '@/types/location';

export type TLocationMapProps = {
	onSuccessfulLocation?: (location: TLocationDetails) => void;
	className?: string;
	inputClassName?: string;
	mapClassName?: string;
	initialLocation?: TLocationDetails;
	showSearchControls?: boolean;
	isInteractive?: boolean;
};
