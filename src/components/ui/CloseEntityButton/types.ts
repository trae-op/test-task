import { Button } from 'react-bootstrap';

export interface ActionButtonProps
	extends Omit<
		React.ComponentProps<typeof Button>,
		'children' | 'size' | 'variant'
	> {
	className?: string;
	iconClassName?: string;
	href?: string;
}
