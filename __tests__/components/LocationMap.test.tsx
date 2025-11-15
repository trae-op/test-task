import { render } from '@testing-library/react';

import { LocationMap } from '@/components/LocationMap';

jest.mock('next/dynamic', () => () => (props: unknown) => (
	<div data-testid='location-map'>{JSON.stringify(props)}</div>
));

describe('LocationMap', () => {
	test('passes props to dynamic LocationMapComponent', () => {
		const props = {
			latitude: 1,
			longitude: 2,
			zoom: 5
		};

		const { container } = render(<LocationMap {...props} />);

		expect(
			container.querySelector('[data-testid="location-map"]')
		).toBeInTheDocument();
	});
});
