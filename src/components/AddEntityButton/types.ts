import { Button } from 'react-bootstrap';

export type TAddEntityButtonProps = Omit<
	React.ComponentProps<typeof Button>,
	'children' | 'size' | 'variant'
> & {
	className?: string;
	iconClassName?: string;
	ariaLabelText?: string;
	iconSize?: number;
	// Provided by NavigationLink wrapper; should not reach DOM
	isActive?: boolean;
	text?: string;
};
