import { render, screen } from '@testing-library/react';

import { LocationMapComponent } from '@/components/LocationMap/LocationMapComponent';

import { UKRAINE_POLYGON, WORLD_BOUNDS_POLYGON } from '@/constants';

jest.mock('react-leaflet', () => ({
	MapContainer: ({ children }: { children: React.ReactNode }) => (
		<div data-testid='map-container'>{children}</div>
	),
	Marker: () => <div data-testid='marker' />,
	Polygon: () => <div data-testid='polygon' />,
	TileLayer: () => <div data-testid='tile-layer' />,
	useMap: () => ({ setView: jest.fn() }),
	useMapEvents: () => ({ on: jest.fn() })
}));

const UKRAINE_MASK_POLYGON: [number, number][][] = [
	WORLD_BOUNDS_POLYGON,
	[...UKRAINE_POLYGON].reverse()
];

describe('LocationMap', () => {
	test('passes props to dynamic LocationMapComponent', () => {
		const props = {
			latitude: 1,
			longitude: 2,
			zoom: 5,
			polygon: {
				availableBounds: UKRAINE_POLYGON,
				disabledBounds: UKRAINE_MASK_POLYGON
			}
		};

		render(<LocationMapComponent {...props} />);

		expect(screen.getByTestId('location-map')).toBeInTheDocument();
	});
});
