import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';

import styles from './SelectField.module.scss';
import type { SelectProps } from './types';

export const SelectField = ({
	options,
	value,
	onChange,
	placeholder,
	className,
	disabledOptions
}: SelectProps) => {
	const t = useTranslations('App');

	return (
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
				<option
					key={option.value}
					disabled={
						disabledOptions
							? disabledOptions.some(
									disabled =>
										(typeof disabled === 'object'
											? disabled.value
											: disabled) === option.value
								)
							: undefined
					}
					value={option.value}
				>
					{t(option.label)}
				</option>
			))}
		</Form.Select>
	);
};
