import { ButtonProps as BaseButtonProps } from "react-bootstrap";
import { Icon as IconType } from "react-bootstrap-icons";

export type ButtonProps = BaseButtonProps & {
  text: string;
  IconComponent?: IconType;
  iconClassName?: string;
  textClassName?: string;
};
