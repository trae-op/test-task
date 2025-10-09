import React from "react";
import { Button } from "react-bootstrap";
import { XLg } from "react-bootstrap-icons";
import clsx from "clsx";

import { CircleActionButtonProps } from "./types";
import styles from "./CircleActionButton.module.scss";

const BLOCK = "circle-action-btn";

export const CircleActionButton: React.FC<CircleActionButtonProps> = ({
  Icon = XLg,
  className = "",
  iconClassName = "",
  ariaLabelText,
  iconSize = 20,
  onClick,
  ...restProps
}) => (
  <Button
    className={clsx(styles[BLOCK], className)}
    variant="light"
    aria-label={ariaLabelText}
    onClick={onClick}
    {...restProps}
  >
    <Icon
      className={clsx(styles[`${BLOCK}__icon`], iconClassName)}
      size={iconSize}
    />
  </Button>
);
