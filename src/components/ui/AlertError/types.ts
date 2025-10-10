import { AlertProps } from "react-bootstrap";
import { Icon as IconType } from "react-bootstrap-icons";

export type IconProps = {
  IconComponent?: IconType;
  iconClassName?: string;
};
export type AlertErrorProps = AlertProps &
  IconProps & {
    text: string;
  };
