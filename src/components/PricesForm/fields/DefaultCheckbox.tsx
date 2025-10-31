import { memo } from 'react';
import { Form } from 'react-bootstrap';

type TDefaultCheckboxProps = {
	checked: boolean;
	disabled: boolean;
	onChange: (checked: boolean) => void;
	label: string;
};

export const DefaultCheckbox = memo(
	({ checked, disabled, onChange, label }: TDefaultCheckboxProps) => (
		<Form.Group className='mb-3' controlId='priceDefault'>
			<Form.Check
				type='checkbox'
				label={label}
				checked={checked}
				disabled={disabled}
				onChange={e => onChange(e.target.checked)}
			/>
		</Form.Group>
	)
);
