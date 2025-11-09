import dynamic from 'next/dynamic';

import type { TLocationMapProps } from './types';

const DynamicLocationMap = dynamic<TLocationMapProps>(
	async () => {
		const componentModule = await import('./LocationMapComponent');
		return componentModule.LocationMapComponent;
	},
	{ ssr: false }
);

export const LocationMap = (props: TLocationMapProps) => (
	<DynamicLocationMap {...props} />
);
