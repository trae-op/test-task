import { Alert } from "react-bootstrap";
import type { AlertErrorProps, IconProps } from "./types";
import clsx from "clsx";

import styles from "./AlertError.module.scss";

const BLOCK = "base-alert";

const Icon = ({ IconComponent, iconClassName }: IconProps) => {
  if (IconComponent === undefined) {
    return null;
  }

  return (
    <span className={clsx(styles[`${BLOCK}__icon-wrapper`])}>
      <IconComponent size={13} className={iconClassName} />
    </span>
  );
};

export const AlertError = ({
  children,
  iconClassName,
  IconComponent,
  text,
  ...rest
}: AlertErrorProps) => (
  <Alert variant="danger" {...rest}>
    <Icon iconClassName={iconClassName} IconComponent={IconComponent} />
    {text}
  </Alert>
);
