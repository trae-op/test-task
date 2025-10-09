import React from "react";
import Form from "react-bootstrap/Form";
import clsx from "clsx";
import { ITextFieldProps } from "./types";
import styles from "./TextField.module.scss";

const BLOCK = "text-field";

export const TextField: React.FC<ITextFieldProps> = ({
  className,
  inputClassName = "",
  ...rest
}) => (
  <div className={clsx(styles[BLOCK], className)}>
    <Form.Control
      className={clsx(styles[`${BLOCK}__input`], inputClassName)}
      {...rest}
    />
  </div>
);
