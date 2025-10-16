import { Button } from 'react-bootstrap';

export type TAddContentButtonProps = Omit<
	React.ComponentProps<typeof Button>,
	'children' | 'size' | 'variant'
> & {
	className?: string;
	iconClassName?: string;
};
