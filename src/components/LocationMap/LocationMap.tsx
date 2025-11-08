import dynamic from 'next/dynamic';

import type { TLocationMapProps } from './types';

const LocationMapClient = dynamic<TLocationMapProps>(
	async () => {
		const module = await import('./LocationMapClient');
		return module.LocationMapClient;
	},
	{ ssr: false }
);

export const LocationMap = (props: TLocationMapProps) => (
	<LocationMapClient {...props} />
);
