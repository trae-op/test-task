import React from "react";

import { Button } from "react-bootstrap";
import { XLg } from "react-bootstrap-icons";

import type { CircleActionButtonProps } from "./types";

import styles from "./CircleActionButton.module.css";

export const CircleActionButton: React.FC<CircleActionButtonProps> = ({
  Icon = XLg,
  className = "",
  iconClassName = "",
  size = 20,
  ...restProps
}) => {
  const combinedClassName = `${styles["circle-action-btn"]} ${className}`;
  const combinedIconClassName = `${styles["circle-action-btn__icon"]} ${iconClassName}`;

  return (
    <Button className={combinedClassName} variant="light" {...restProps}>
      <Icon className={combinedIconClassName} size={size} />
    </Button>
  );
};
