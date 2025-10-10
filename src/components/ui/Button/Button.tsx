import * as React from "react";
import { Button as BaseButton } from "react-bootstrap";
import clsx from "clsx";

import { ButtonProps } from "./types";

import styles from "./Button.module.scss";

const BLOCK = "base-button";

export const Button: React.FC<ButtonProps> = ({
  text,
  IconComponent,
  className = "",
  iconClassName = "",
  textClassName = "",
  children,
  ...rest
}) => (
  <BaseButton
    className={clsx(styles[BLOCK], styles[`${BLOCK}--rounded`], className)}
    {...rest}
  >
    {IconComponent && (
      <span className={clsx(styles[`${BLOCK}__icon-wrapper`])}>
        <IconComponent size={13} className={iconClassName} />
      </span>
    )}
    <span className={textClassName}>
      {text}
      {children}
    </span>
  </BaseButton>
);
