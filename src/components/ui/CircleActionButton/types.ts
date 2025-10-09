import { IconProps } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

type IconComponentType = React.ComponentType<IconProps>;

export interface CircleActionButtonProps
  extends Omit<
    React.ComponentProps<typeof Button>,
    "children" | "size" | "variant"
  > {
  Icon?: IconComponentType;
  className?: string;
  iconClassName?: string;
}
