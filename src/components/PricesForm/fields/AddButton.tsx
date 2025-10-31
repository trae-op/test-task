import { memo } from 'react';

import { Button } from '@/components/Button';

type TAddButtonProps = {
	onClick: () => void;
	text: string;
};

export const AddButton = memo(({ onClick, text }: TAddButtonProps) => (
	<div className='ms-auto'>
		<Button type='button' onClick={onClick} text={text} />
	</div>
));
