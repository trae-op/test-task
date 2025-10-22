import { Form } from 'react-bootstrap';

import type { TRequiredLabelProps } from './types';

export const RequiredLabel = ({ text }: TRequiredLabelProps) => (
	<Form.Label>
		{text} <span className='text-danger'>*</span>
	</Form.Label>
);
