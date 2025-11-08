import dynamic from 'next/dynamic';

import type { TLocationMapProps } from './types';

const DynamicLocationMap = dynamic<TLocationMapProps>(
	async () => {
		const module = await import('./LocationMapComponent');
		return module.LocationMapComponent;
	},
	{ ssr: false }
);

export const LocationMap = (props: TLocationMapProps) => (
	<DynamicLocationMap {...props} />
);
