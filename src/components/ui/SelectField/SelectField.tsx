import clsx from 'clsx';
import { Form } from 'react-bootstrap';

import styles from './SelectField.module.scss';
import type { SelectProps } from './types';

export const SelectField = ({
	options,
	value,
	onChange,
	placeholder,
	className
}: SelectProps) => (
	<Form.Select
		value={value}
		onChange={onChange}
		className={clsx(styles['select-field'], className)}
	>
		{placeholder && (
			<option value='' disabled hidden>
				{placeholder}
			</option>
		)}
		{options.map(option => (
			<option key={option.value} value={option.value}>
				{option.label}
			</option>
		))}
	</Form.Select>
);
