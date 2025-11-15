import { render } from '@testing-library/react';

import { MultiSelectField } from '@/components/MultiSelectField';

describe('MultiSelectField', () => {
	test('renders with provided options and value without crashing', () => {
		const options = [
			{ value: '1', label: 'One' },
			{ value: '2', label: 'Two' }
		];

		const { container } = render(
			<MultiSelectField
				options={options}
				value={[options[0]]}
				onChange={jest.fn()}
			/>
		);

		expect(container.firstChild).not.toBeNull();
	});
});
