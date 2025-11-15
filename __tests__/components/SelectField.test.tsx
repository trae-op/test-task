import { fireEvent, render, screen } from '@testing-library/react';

import { SelectField } from '@/components/SelectField';

describe('SelectField', () => {
	test('renders options and placeholder', () => {
		const options = [
			{ value: '1', label: 'One' },
			{ value: '2', label: 'Two' }
		];

		render(
			<SelectField
				options={options}
				value=''
				placeholder='Select option'
				onChange={jest.fn()}
			/>
		);

		const select = screen.getByRole('combobox');
		expect(select).toBeInTheDocument();
		expect(screen.getByText('Select option')).toBeInTheDocument();
		expect(screen.getByText('One')).toBeInTheDocument();
		expect(screen.getByText('Two')).toBeInTheDocument();
	});

	test('disables options based on disabledOptions prop', () => {
		const options = [
			{ value: '1', label: 'One' },
			{ value: '2', label: 'Two' }
		];

		render(
			<SelectField
				options={options}
				value=''
				disabledOptions={[{ value: '2', label: 'Two' }]}
				onChange={jest.fn()}
			/>
		);

		const optionTwo = screen.getByText('Two') as HTMLOptionElement;
		expect(optionTwo.disabled).toBe(true);
	});

	test('calls onChange when value changes', () => {
		const options = [
			{ value: '1', label: 'One' },
			{ value: '2', label: 'Two' }
		];
		const handleChange = jest.fn();

		render(<SelectField options={options} value='1' onChange={handleChange} />);

		fireEvent.change(screen.getByRole('combobox'), {
			target: { value: '2' }
		});

		expect(handleChange).toHaveBeenCalledTimes(1);
	});
});
