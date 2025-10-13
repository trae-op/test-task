import { Button } from "react-bootstrap";
import { PlusLg } from "react-bootstrap-icons";
import clsx from "clsx";

import { TAddContentButtonProps } from "./types";
import styles from "./AddContentButton.module.scss";

const BLOCK = "add-content-btn";

export const AddContentButton = ({
  className = "",
  iconClassName = "",
  ariaLabelText,
  iconSize = 20,
  ...restProps
}: TAddContentButtonProps) => (
  <Button
    className={clsx(styles[BLOCK], className)}
    variant="light"
    aria-label={ariaLabelText}
    {...restProps}
  >
    <PlusLg
      className={clsx(styles[`${BLOCK}__icon`], iconClassName)}
      size={iconSize}
    />
  </Button>
);
