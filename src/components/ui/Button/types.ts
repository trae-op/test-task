import { ButtonProps as BaseButtonProps } from 'react-bootstrap';
import { Icon as IconType } from 'react-bootstrap-icons';

export type IconProps = {
	IconComponent?: IconType;
	iconClassName?: string;
};

export type ButtonProps = BaseButtonProps &
	IconProps & {
		text: string;
		textClassName?: string;
	};
