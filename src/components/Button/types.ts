import { ButtonProps as BaseButtonProps } from 'react-bootstrap';
import { Icon as TIcon } from 'react-bootstrap-icons';

export type IconProps = {
	IconComponent?: TIcon;
	iconClassName?: string;
	iconSize?: number;
};

export type ButtonProps = BaseButtonProps &
	IconProps & {
		text?: string;
		textClassName?: string;
		isLoading?: boolean;
	};
